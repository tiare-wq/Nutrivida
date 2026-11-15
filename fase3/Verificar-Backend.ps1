[CmdletBinding()]
param ()

$ErrorActionPreference = 'Stop'

try {
    . (Join-Path $PSScriptRoot 'Configurar-Java.ps1')

    $mavenCommand = Get-Command mvn.cmd -ErrorAction SilentlyContinue

    if ($mavenCommand) {
        $mavenExecutable = $mavenCommand.Source
    }
    else {
        $mavenExecutable = Join-Path $PSScriptRoot `
            '..\..\herramientas\apache-maven-3.9.11\bin\mvn.cmd'
    }

    if (-not (Test-Path -LiteralPath $mavenExecutable -PathType Leaf)) {
        throw 'Instala Maven 3.9 y agrega su carpeta bin al PATH. Revisa README.md.'
    }

    $mavenArguments = @('-f', 'backend/pom.xml', 'clean', 'verify')
    $portableRepository = Join-Path $PSScriptRoot '..\..\herramientas\m2'

    if (Test-Path -LiteralPath $portableRepository -PathType Container) {
        $repositoryPath = (Resolve-Path -LiteralPath $portableRepository).Path
        $mavenArguments += "-Dmaven.repo.local=$repositoryPath"
    }

    Push-Location $PSScriptRoot

    try {
        Write-Host "Verificando el backend con Java 21: $env:JAVA_HOME"
        & $mavenExecutable @mavenArguments
        $verificationExitCode = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }

    exit $verificationExitCode
}
catch {
    Write-Error $_ -ErrorAction Continue
    exit 1
}
