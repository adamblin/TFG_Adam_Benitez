async function main() {
  const healthUrl = 'http://localhost:3000/';

  let response;
  try {
    response = await fetch(healthUrl, { method: 'GET' });
  }
  catch {
    throw new Error(`Backend is not reachable at ${healthUrl}. Start it first with npm run start:all.`);
  }

  if (response.status !== 200) {
    throw new Error(`Expected 200 from ${healthUrl}, got ${response.status}`);
  }

  console.log('Backend health check passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});