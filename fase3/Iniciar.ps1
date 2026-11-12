[CmdletBinding()]
param (
    [string]$AdminEmail = 'admin@nutrivida.cl',
    [string]$AdminPassword = $env:ADMIN_PASSWORD,
    [string]$DbUrl = $env:DB_URL,
    [string]$DbUser = $env:DB_USER,
    [string]$DbPassword = $env:DB_PASSWORD,
    [string]$ClaveCuentasIniciales = $env:CLAVE_CUENTAS_INICIALES,
    [switch]$DatosIniciales,
    [switch]$Abrir
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

function Read-SecretText {
    param ([string]$Message)

    $secureValue = Read-Host $Message -AsSecureString
    return [System.Net.NetworkCredential]::new('', $secureValue).Password
}

function Wait-Application {
    param ([string]$Url)

    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        try {
            Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
            return
        }
        catch {
            Start-Sleep -Milliseconds 500
        }
    }

    throw "No se pudo iniciar $Url. Revisa los registros en .local."
}

$localDirectory = Join-Path $PSScriptRoot '.local'
New-Item -ItemType Directory -Force -Path $localDirectory | Out-Null

foreach ($port in @(8081, 8082, 5173)) {
    $listener = Get-NetTCPConnection `
        -LocalPort $port `
        -State Listen `
        -ErrorAction SilentlyContinue

    if ($listener) {
        throw "El puerto $port está ocupado. No se detuvo ningún programa."
    }
}

# PostgreSQL es la base de ejecución. H2 solo está disponible en las pruebas.
if (-not $DbUrl) {
    $DbUrl = 'jdbc:postgresql://localhost:5432/nutrivida'
}

if (-not $DbUser) {
    $DbUser = 'nutrivida'
}

if (-not $DbPassword) {
    $DbPassword = Read-SecretText "Contraseña PostgreSQL del usuario $DbUser"
}

if ($DbUrl -notmatch '^jdbc:postgresql://[^/]+/[^?]+') {
    throw 'DB_URL debe tener el formato jdbc:postgresql://HOST:PUERTO/BASE.'
}

$databaseUri = [Uri]($DbUrl.Substring(5))
$databasePort = 5432

if ($databaseUri.Port -gt 0) {
    $databasePort = $databaseUri.Port
}

$connection = New-Object System.Net.Sockets.TcpClient

try {
    $pendingConnection = $connection.ConnectAsync($databaseUri.Host, $databasePort)

    if (-not $pendingConnection.Wait(3000) -or -not $connection.Connected) {
        throw 'No se pudo establecer la conexión con PostgreSQL.'
    }
}
catch {
    $address = "$($databaseUri.Host):$databasePort"
    throw "PostgreSQL no responde en $address. Inicia el servidor y crea la base nutrivida."
}
finally {
    $connection.Dispose()
}

$env:DB_URL = $DbUrl
$env:DB_USER = $DbUser
$env:DB_PASSWORD = $DbPassword
$env:SPRING_PROFILES_ACTIVE = 'postgres'
Remove-Item Env:SPRING_DATASOURCE_URL -ErrorAction SilentlyContinue

. (Join-Path $PSScriptRoot 'Configurar-Java.ps1')

$mavenCommand = Get-Command mvn.cmd -ErrorAction SilentlyContinue

if ($mavenCommand) {
    $mavenExecutable = $mavenCommand.Source
}
else {
    $mavenExecutable = Join-Path $PSScriptRoot `
        '..\..\herramientas\apache-maven-3.9.11\bin\mvn.cmd'
}

if (-not (Test-Path $mavenExecutable)) {
    throw 'Instala Maven 3.9 y Java 25. Configura JAVA_HOME según README.md.'
}

$secretFile = Join-Path $localDirectory 'jwt-secret.txt'

if (-not (Test-Path $secretFile)) {
    $randomBytes = New-Object byte[] 48
    $randomGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $randomGenerator.GetBytes($randomBytes)
    $randomGenerator.Dispose()

    [IO.File]::WriteAllText($secretFile, [Convert]::ToBase64String($randomBytes))
}

$env:JWT_SECRET = [IO.File]::ReadAllText($secretFile)
$env:ADMIN_EMAIL = $AdminEmail

if (-not $AdminPassword) {
    $AdminPassword = Read-SecretText 'Contraseña para el administrador inicial'
}

$validAdminPassword = $AdminPassword.Length -ge 8 `
    -and $AdminPassword -match '[A-Za-z]' `
    -and $AdminPassword -match '[0-9]'

if (-not $validAdminPassword) {
    throw 'La contraseña debe tener al menos 8 caracteres, letras y números.'
}

$env:ADMIN_PASSWORD = $AdminPassword

if ($DatosIniciales) {
    $env:CARGAR_DATOS_INICIALES = 'true'

    if (-not $ClaveCuentasIniciales) {
        $ClaveCuentasIniciales = Read-SecretText 'Contraseña para las cuentas iniciales (Enter = la misma del administrador)'
    }

    if ($ClaveCuentasIniciales) {
        $validAccountsPassword = $ClaveCuentasIniciales.Length -ge 8 `
            -and $ClaveCuentasIniciales -match '[A-Za-z]' `
            -and $ClaveCuentasIniciales -match '[0-9]'

        if (-not $validAccountsPassword) {
            throw 'La contraseña de las cuentas iniciales debe tener al menos 8 caracteres, letras y números.'
        }

        $env:CLAVE_CUENTAS_INICIALES = $ClaveCuentasIniciales
    }
}
$portableRepository = Join-Path $PSScriptRoot '..\..\herramientas\m2'
$mavenArguments = @('-f', 'backend/pom.xml', 'package', '-DskipTests')

if (Test-Path $portableRepository) {
    $repositoryPath = (Resolve-Path $portableRepository).Path
    $mavenArguments += "-Dmaven.repo.local=$repositoryPath"
}

& $mavenExecutable @mavenArguments

if ($LASTEXITCODE -ne 0) {
    throw 'Falló la compilación Java. Revisa el mensaje anterior.'
}

Push-Location frontend

try {
    if (-not (Test-Path node_modules)) {
        & npm.cmd ci

        if ($LASTEXITCODE -ne 0) {
            throw 'Falló la instalación de dependencias del frontend.'
        }
    }
}
finally {
    Pop-Location
}

$startedProcesses = @()

try {
    foreach ($service in @('usuarios', 'administracion')) {
        $serviceDirectory = Join-Path $PSScriptRoot "backend\$service-service"
        $jarFile = Join-Path $serviceDirectory "target\$service-service-1.0.0.jar"
        $startOptions = @{
            FilePath = $javaExecutable
            ArgumentList = @('-jar', ('"' + $jarFile + '"'))
            WorkingDirectory = $serviceDirectory
            WindowStyle = 'Hidden'
            RedirectStandardOutput = Join-Path $localDirectory "$service.log"
            RedirectStandardError = Join-Path $localDirectory "$service-error.log"
            PassThru = $true
        }

        $process = Start-Process @startOptions
        $startedProcesses += $process.Id
    }

    $nodeExecutable = (Get-Command node.exe).Source
    $viteFile = Join-Path $PSScriptRoot 'frontend\node_modules\vite\bin\vite.js'
    $frontendOptions = @{
        FilePath = $nodeExecutable
        ArgumentList = ('"' + $viteFile + '"')
        WorkingDirectory = Join-Path $PSScriptRoot 'frontend'
        WindowStyle = 'Hidden'
        RedirectStandardOutput = Join-Path $localDirectory 'frontend.log'
        RedirectStandardError = Join-Path $localDirectory 'frontend-error.log'
        PassThru = $true
    }

    $process = Start-Process @frontendOptions
    $startedProcesses += $process.Id
    $processFile = Join-Path $localDirectory 'processes.json'
    $startedProcesses | ConvertTo-Json | Set-Content $processFile

    foreach ($url in @(
        'http://localhost:8081/api/health',
        'http://localhost:8082/api/health',
        'http://localhost:5173'
    )) {
        Wait-Application $url
    }

    Write-Host 'NutriVida disponible en http://localhost:5173'
    Write-Host 'Swagger usuarios: http://localhost:8081/swagger-ui/index.html'
    Write-Host 'Swagger administración: http://localhost:8082/swagger-ui/index.html'

    if ($Abrir) {
        Start-Process 'http://localhost:5173'
    }
}
catch {
    foreach ($processId in $startedProcesses) {
        Stop-Process -Id $processId -ErrorAction SilentlyContinue
    }

    throw
}
finally {
    $env:ADMIN_PASSWORD = $null
    $AdminPassword = $null
    $env:DB_PASSWORD = $null
    $DbPassword = $null
    $env:CARGAR_DATOS_INICIALES = $null
    $env:CLAVE_CUENTAS_INICIALES = $null
    $ClaveCuentasIniciales = $null
}
