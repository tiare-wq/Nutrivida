@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Instala Node.js 22.13 o superior y vuelve a intentar.
 pause
 exit /b 1
)
node -e "const [m,n]=process.versions.node.split('.').map(Number);if(m<22||(m===22&&n<13))process.exit(1)"
if errorlevel 1 (
 echo Necesitas Node.js 22.13 o superior.
 pause
 exit /b 1
)
if not exist dist\index.html (
 echo Preparando la aplicacion. La primera vez necesita Internet.
 call npm.cmd ci
 if errorlevel 1 goto fallo
 call npm.cmd run build
 if errorlevel 1 goto fallo
)
echo Abre http://127.0.0.1:4387 en tu navegador.
echo Conserva esta ventana abierta. Para detener usa Ctrl+C.
node server/index.js
pause
exit /b
:fallo
echo No se pudo preparar la aplicacion. Revisa el mensaje anterior.
pause
exit /b 1
