const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const runtimeDir = path.join(repoRoot, '.runtime');
const stateFile = path.join(runtimeDir, 'runtime-state.json');

function stopProcessByPid(pid) {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'inherit' });
    return;
  }

  try {
    process.kill(pid, 'SIGTERM');
  }
  catch {
  }
}

function stopDockerCompose() {
  const dockerCheck = spawnSync('docker', ['compose', 'down', '--remove-orphans'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  return dockerCheck.status ?? 0;
}

function stopAll() {
  console.log('Stopping app processes...');

  if (fs.existsSync(stateFile)) {
    try {
      const entries = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      for (const entry of entries) {
        if (entry && entry.Pid) {
          stopProcessByPid(entry.Pid);
          console.log(`Stopped ${entry.Name} (PID ${entry.Pid})`);
        }
      }
    }
    catch {
      console.log('Could not parse runtime state. Continuing with port cleanup.');
    }

    try {
      fs.rmSync(stateFile, { force: true });
    }
    catch {
    }
  }

  const dockerStatus = stopDockerCompose();
  if (dockerStatus !== 0) {
    console.log('Docker compose down failed or Docker was not running.');
  }

  console.log('All services stopped.');
}

stopAll();