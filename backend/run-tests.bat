@echo off
REM Spring Boot Backend Test Runner (Windows)
REM Run this script to execute all tests with detailed output

echo ======================================
echo   Spring Boot Backend Test Runner
echo ======================================
echo.

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Maven is not installed or not in PATH
    echo.
    echo Please install Maven:
    echo   - Download from https://maven.apache.org/download.cgi
    echo   - Add to PATH environment variable
    pause
    exit /b 1
)

echo √ Maven found
mvn --version | findstr "Apache Maven"
echo.

REM Check if pom.xml exists
if not exist "pom.xml" (
    echo X pom.xml not found. Please run this script from the backend directory.
    pause
    exit /b 1
)

echo ======================================
echo   Running Tests...
echo ======================================
echo.

REM Run tests with detailed output
call mvn clean test

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo   √ ALL TESTS PASSED!
    echo ======================================
) else (
    echo.
    echo ======================================
    echo   X TESTS FAILED
    echo ======================================
    echo.
    echo Check the output above for details.
)

echo.
echo To see detailed test results:
echo   - Open: target\surefire-reports\index.html
echo   - Or check: target\surefire-reports\*.txt
echo.

pause
exit /b %ERRORLEVEL%
