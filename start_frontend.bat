@echo off
setlocal
title Frontend - Clinica Veterinaria
color 0A
cls

echo.
echo ==================================================
echo   INICIANDO FRONTEND - Clinica Veterinaria React
echo ==================================================
echo.

echo 🔍 Verificando requisitos...
echo.

:: Verificar Node.js (usando call para forzar espera)
call node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no encontrado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js instalado
echo.

:: Verificar npm (usando call para forzar espera)
call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm no disponible
    echo.
    echo Por favor instala npm o revisa tu instalación de Node.js
    pause
    exit /b 1
)
echo ✅ npm disponible
echo.

:: Verificar package.json
if not exist "package.json" (
    echo ❌ ERROR: Archivo package.json no encontrado
    echo.
    echo Asegúrate de ejecutar este script desde la carpeta del proyecto
    echo Directorio: %CD%
    pause
    exit /b 1
)
echo ✅ Archivo package.json encontrado
echo.

:: Detener procesos existentes
echo 🔄 Limpiando procesos anteriores...
call taskkill /F /IM node.exe >nul 2>&1
call taskkill /F /IM npm.cmd >nul 2>&1
echo ✅ Procesos Node.js detenidos
echo.

:: Navegar al directorio del proyecto
cd /d "%CD%"
if not exist "package.json" (
    echo ❌ ERROR: No estás en el directorio correcto
    echo.
    echo Por favor ejecuta este script desde la carpeta del proyecto
    pause
    exit /b 1
)
echo ✅ Directorio del proyecto verificado
echo.

echo 🔄 Instalando/actualizando dependencias...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Fallo al instalar dependencias
    echo.
    echo Intentando solución automática...
    echo.
    echo 1. Limpiando caché...
    call npm cache clean --force
    
    echo.
    echo 2. Reinstalando dependencias...
    call npm install
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ ERROR: No se pudo instalar las dependencias
        echo.
        echo Soluciones posibles:
        echo 1. Revisa tu conexión a internet
        echo 2. Revisa si tienes permisos de escritura en la carpeta
        echo 3. Intenta ejecutar como administrador
        echo 4. Revisa si npm está correctamente instalado
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.
echo 🚀 Iniciando servidor frontend...
echo.
echo ==================================================
echo   Frontend disponible en: http://localhost:3000
echo   Presiona Ctrl+C para detener el servidor
echo   El servidor se abrirá automáticamente en tu navegador
echo ==================================================
echo.

:: Intentar abrir navegador automáticamente
start http://localhost:3000

echo.
echo 🎉 Servidor iniciado correctamente!
echo.
echo El servidor está corriendo en: http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo.
echo Esta ventana se mantendrá abierta mientras el servidor corre
echo.

:: Iniciar frontend en este mismo proceso
call npm start

echo.
echo ❌ Frontend detenido
echo Gracias por usar la aplicación
echo.
pause