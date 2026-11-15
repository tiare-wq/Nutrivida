# Cargar con: . .\Configurar-Java.ps1
# La seleccion solo afecta a esta sesion y sus procesos hijos.

function Test-NutriVidaJdk21 {
    param ([string]$Directory)

    if (-not $Directory) {
        return $false
    }

    $candidateJava = Join-Path $Directory 'bin\java.exe'
    $candidateJavac = Join-Path $Directory 'bin\javac.exe'

    if (-not (Test-Path -LiteralPath $candidateJava -PathType Leaf) -or
        -not (Test-Path -LiteralPath $candidateJavac -PathType Leaf)) {
        return $false
    }

    try {
        $runtimeVersion = & $candidateJava --version 2>$null | Out-String
        $runtimeSucceeded = $LASTEXITCODE -eq 0
        $compilerVersion = & $candidateJavac --version 2>$null | Out-String
        $compilerSucceeded = $LASTEXITCODE -eq 0

        return $runtimeSucceeded -and $compilerSucceeded `
            -and $runtimeVersion -match '(?m)^(?:openjdk|java) 21(?:[.\s+"-]|$)' `
            -and $compilerVersion -match '(?m)^javac 21(?:[.\s+"-]|$)'
    }
    catch {
        return $false
    }
}

$nutriVidaJavaCandidates = [System.Collections.Generic.List[string]]::new()

if ($env:JAVA_HOME) {
    $nutriVidaJavaCandidates.Add($env:JAVA_HOME)
}

$nutriVidaJavaSearchDirectories = @(
    (Join-Path $PSScriptRoot '.local\tools')
)

if ($env:ProgramFiles) {
    $nutriVidaJavaSearchDirectories += Join-Path $env:ProgramFiles 'Eclipse Adoptium'
    $nutriVidaJavaSearchDirectories += Join-Path $env:ProgramFiles 'Java'
}

$nutriVidaJavaSearchDirectories += Join-Path $PSScriptRoot '..\..\herramientas'

foreach ($searchDirectory in $nutriVidaJavaSearchDirectories) {
    $installedJdks = Get-ChildItem -LiteralPath $searchDirectory -Directory `
        -Filter 'jdk-21*' -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending

    foreach ($installedJdk in $installedJdks) {
        $nutriVidaJavaCandidates.Add($installedJdk.FullName)
    }
}

$nutriVidaJavaOnPath = Get-Command java.exe -CommandType Application `
    -ErrorAction SilentlyContinue | Select-Object -First 1

if ($nutriVidaJavaOnPath) {
    $javaBinDirectory = Split-Path -Parent $nutriVidaJavaOnPath.Source
    $nutriVidaJavaCandidates.Add((Split-Path -Parent $javaBinDirectory))
}

$nutriVidaSelectedJdk = $null

foreach ($candidateDirectory in $nutriVidaJavaCandidates) {
    if (Test-NutriVidaJdk21 -Directory $candidateDirectory) {
        $nutriVidaSelectedJdk = (Resolve-Path -LiteralPath $candidateDirectory).Path
        break
    }
}

if (-not $nutriVidaSelectedJdk) {
    throw 'Se necesita un JDK 21 completo (java y javac). Instala Java 21, configura JAVA_HOME o extrae el JDK portable en .local\tools\jdk-21*. Revisa README.md.'
}

$env:JAVA_HOME = $nutriVidaSelectedJdk
$nutriVidaJavaBin = Join-Path $nutriVidaSelectedJdk 'bin'
$env:PATH = "$nutriVidaJavaBin;$env:PATH"
$javaExecutable = Join-Path $nutriVidaJavaBin 'java.exe'
