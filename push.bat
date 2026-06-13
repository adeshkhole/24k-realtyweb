@echo off
echo ===================================================
echo             24K Realty - Git Push Helper          
echo ===================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL: "
if "%REPO_URL%"=="" (
    echo Error: Repository URL cannot be empty!
    pause
    exit /b
)
echo.
echo [1/2] Connecting to repository...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [2/2] Pushing code to branch 'main'...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo Success: Code successfully pushed to GitHub!
) else (
    echo.
    echo Error: Failed to push code. Please make sure:
    echo 1. You created the repository on GitHub.
    echo 2. The URL is correct.
    echo 3. You are logged into GitHub in your terminal/browser.
)
echo.
pause
