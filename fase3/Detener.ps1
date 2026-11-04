$ErrorActionPreference = 'Stop'
$processFile = Join-Path $PSScriptRoot '.local\processes.json'

if (Test-Path $processFile) {
    $processIds = Get-Content $processFile -Raw | ConvertFrom-Json

    foreach ($processId in $processIds) {
        $process = Get-CimInstance Win32_Process `
            -Filter "ProcessId=$processId" `
            -ErrorAction SilentlyContinue

        $belongsToProject = $process `
            -and $process.CommandLine `
            -and $process.CommandLine.Contains($PSScriptRoot)

        if ($belongsToProject) {
            Stop-Process -Id $processId -ErrorAction SilentlyContinue
        }
    }

    Remove-Item -LiteralPath $processFile
}

Write-Host 'Se detuvieron los procesos registrados de NutriVida.'
