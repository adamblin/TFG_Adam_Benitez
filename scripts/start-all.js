const fs = require('node:fs');
const fsp = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const backendPath = path.join(repoRoot, 'backend');
const frontendPath = path.join(repoRoot, 'frontend');
const runtimeDir = path.join(repoRoot, '.runtime');
const logsDir = path.join(runtimeDir, 'logs');
const stateFile = path.join(runtimeDir, 'runtime-state.json');
const composeFile = path.join(repoRoot, 'docker-compose.yml');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function writeLine(message) {
  process.stdout.write(`${message}\n`);
}

function runSync(command, args, workingDirectory, ignoreErrors = false) {
  const result = spawnSync(command, args, {
    cwd: workingDirectory,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0 && !ignoreErrors) {
    const exitCode = typeof result.status === 'number' ? result.status : 1;
    writeLine(`ERROR: Command failed with exit code ${exitCode}`);
    writeLine(`Command: ${command} ${args.join(' ')}`);
    process.exit(exitCode);
  }

  return result;
}

function getCommandOutput(result) {
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
}

function hasFailedMigration(result) {
  const output = getCommandOutput(result);
  return /P3009|P3018|failed migrations|migration .* failed/i.test(output);
}

function runDetached(command, args, workingDirectory, outLogPath, errLogPath) {
  const outFile = fs.openSync(outLogPath, 'w');
  const errFile = fs.openSync(errLogPath, 'w');
  const child = spawn(command, args, {
    cwd: workingDirectory,
    stdio: ['ignore', outFile, errFile],
    shell: process.platform === 'win32',
  });

  child.unref();
  fs.closeSync(outFile);
  fs.closeSync(errFile);

  return child;
}

function waitForHttpOk(url, timeoutMs) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;

    const poll = async () => {
      while (Date.now() < deadline) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3000);
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timer);
          if (response.status === 200) {
            resolve(true);
            return;
          }
        }
        catch {
        }

        await new Promise((resolveDelay) => setTimeout(resolveDelay, 750));
      }

      resolve(false);
    };

    void poll();
  });
}

async function main() {
  ensureDirectory(runtimeDir);
  ensureDirectory(logsDir);

  writeLine('Starting database with Docker Compose...');
  runSync('docker', ['compose', '-f', composeFile, 'up', '-d', '--remove-orphans'], repoRoot);

  const backendMigrationsPath = path.join(backendPath, 'prisma', 'migrations');
  const backendSourcePath = path.join(backendPath, 'src');
  const frontendAppPath = path.join(frontendPath, 'app');
  const hasBackendMigrations = fs.existsSync(backendMigrationsPath)
    && fs.readdirSync(backendMigrationsPath, { withFileTypes: true })
      .some((entry) => entry.isDirectory() && fs.existsSync(path.join(backendMigrationsPath, entry.name, 'migration.sql')));

  if (hasBackendMigrations) {
    writeLine('Applying Prisma migrations...');
    const migrateDeployResult = runSync(npxCommand, ['prisma', 'migrate', 'deploy'], backendPath, true);

    if (migrateDeployResult.status !== 0 && hasFailedMigration(migrateDeployResult)) {
      writeLine('Detected failed Prisma migrations. Resetting the local database and retrying...');
      runSync(npxCommand, ['prisma', 'migrate', 'reset', '--force', '--skip-generate', '--skip-seed'], backendPath);
      runSync(npxCommand, ['prisma', 'migrate', 'deploy'], backendPath);
    }
  }
  else {
    writeLine('Skipping Prisma migrations: no migration.sql files exist yet.');
  }

  let backendProcess = null;
  if (fs.existsSync(backendSourcePath)) {
    writeLine('Building backend...');
    runSync(npmCommand, ['run', 'build'], backendPath);

    writeLine('Clearing port 3000...');
    if (process.platform === 'win32') {
      const netstat = spawnSync('netstat', ['-ano'], { encoding: 'utf8', shell: true });
      const match = (netstat.stdout || '').split('\n').find((l) => l.includes(':3000') && l.includes('LISTENING'));
      if (match) {
        const pid = match.trim().split(/\s+/).pop();
        if (pid) spawnSync('taskkill', ['/PID', pid, '/T', '/F'], { stdio: 'ignore', shell: true });
      }
    } else {
      spawnSync('sh', ['-c', 'lsof -ti:3000 | xargs kill -9'], { stdio: 'ignore' });
    }

    writeLine('Starting backend API in background...');
    backendProcess = runDetached(
      process.execPath,
      [path.join(backendPath, 'dist', 'main.js')],
      backendPath,
      path.join(logsDir, 'backend.out.log'),
      path.join(logsDir, 'backend.err.log'),
    );

    const backendReady = await waitForHttpOk('http://localhost:3000/', 120000);
    if (!backendReady) {
      throw new Error('Backend did not become healthy on http://localhost:3000 within 120s.');
    }
  }
  else {
    writeLine('Skipping backend build/start: backend/src does not exist yet.');
  }

  let frontendProcess = null;
  if (fs.existsSync(frontendAppPath)) {
    writeLine('Starting frontend in background...');
    frontendProcess = runDetached(
      npmCommand,
      ['run', 'start', '--', '--port', '8081'],
      frontendPath,
      path.join(logsDir, 'frontend.out.log'),
      path.join(logsDir, 'frontend.err.log'),
    );
  }
  else {
    writeLine('Skipping frontend: frontend/app does not exist yet.');
  }

  writeLine('Starting Prisma Studio in background...');
  const studioProcess = runDetached(
    npxCommand,
    ['--yes', 'prisma', 'studio', '--port', '5555'],
    backendPath,
    path.join(logsDir, 'studio.out.log'),
    path.join(logsDir, 'studio.err.log'),
  );

  const state = [];
  if (backendProcess) {
    state.push({ Name: 'backend', Pid: backendProcess.pid, Port: 3000, OutLog: path.join(logsDir, 'backend.out.log'), ErrLog: path.join(logsDir, 'backend.err.log') });
  }
  if (frontendProcess) {
    state.push({ Name: 'frontend', Pid: frontendProcess.pid, Port: 8081, OutLog: path.join(logsDir, 'frontend.out.log'), ErrLog: path.join(logsDir, 'frontend.err.log') });
  }
  state.push({ Name: 'studio', Pid: studioProcess.pid, Port: 5555, OutLog: path.join(logsDir, 'studio.out.log'), ErrLog: path.join(logsDir, 'studio.err.log') });

  await fsp.writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`, 'utf8');

  writeLine('');
  writeLine('Started services:');
  state.forEach((entry) => writeLine(`- ${entry.Name}: PID ${entry.Pid} (port ${entry.Port})`));
  writeLine('');

  if (backendProcess) {
    writeLine('Health/API: http://localhost:3000/');
  }

  if (frontendProcess) {
    writeLine('Frontend dev server: http://localhost:8081');
  }

  writeLine('Prisma Studio: http://localhost:5555');
  writeLine('');
  writeLine('To stop everything: npm run stop:all');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});