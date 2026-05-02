$ErrorActionPreference = 'Stop'

$baseUrl = 'http://localhost:3000'
$healthUrl = "$baseUrl/"

try {
    $health = Invoke-WebRequest -Uri $healthUrl -Method Get -TimeoutSec 10
}
catch {
    throw "Backend is not reachable at $healthUrl. Start it first with .\scripts\start-all.ps1."
}

if ($health.StatusCode -ne 200) {
    throw ("Expected 200 from {0}, got {1}" -f $healthUrl, $health.StatusCode)
}

Write-Host 'Backend health check passed.'
