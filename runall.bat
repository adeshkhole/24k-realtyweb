@echo off
title 24K Realty Launcher
color 0A
echo =======================================================
echo               24K Realty Web Project
echo =======================================================
echo.
echo Launching options:
echo [1] Open index.html directly in default browser
echo [2] Start a local server using Python (http://localhost:8000)
echo.
set /p choice="Enter your choice (1 or 2, default is 1): "

if "%choice%"=="2" (
    echo.
    echo Starting Python HTTP server on port 8000...
    echo Press Ctrl+C in this command window to stop the server.
    echo.
    start "" "http://localhost:8000"
    python -m http.server 8000
) else (
    echo.
    echo Opening index.html in your default web browser...
    start "" "index.html"
)
pause
