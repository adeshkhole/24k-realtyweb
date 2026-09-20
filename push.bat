@echo off
echo ===================================================
echo             24K Realty - Git Push Helper          
echo ===================================================
echo.

echo [1/3] Staging all files...
git add .

echo [2/3] Checking for new changes to commit...
git commit -m "feat: 24K Realty Light Luxury & PropTech update" >nul 2>&1

echo [3/3] Pushing code to GitHub (branch 'main')...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo  SUCCESS: Code successfully pushed to GitHub!
    echo  Your live website will be updated in 1-2 minutes.
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo  NOTE: If push failed, check your GitHub credentials
    echo  or run 'git push origin main' in terminal.
    echo ===================================================
)
echo.
pause
