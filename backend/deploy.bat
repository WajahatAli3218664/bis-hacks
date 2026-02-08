@echo off
echo Deploying backend to Vercel...
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Testing backend first...
python -c "from main import app; print('✅ Backend imports working')"
if %errorlevel% neq 0 (
    echo ❌ Backend import failed
    pause
    exit /b 1
)
echo.
echo Deploying to Vercel...
vercel --prod
echo.
echo Deployment complete!
pause