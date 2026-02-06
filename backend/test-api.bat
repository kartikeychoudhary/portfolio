@echo off
REM Spring Boot Backend API Test Script (Windows)
REM This script tests all major endpoints of the portfolio backend

set BASE_URL=http://localhost:8080

echo ==================================
echo Portfolio Backend API Test Script
echo ==================================
echo.

echo 1. Testing Backend Health...
curl -s -o NUL -w "HTTP Status: %%{http_code}" %BASE_URL%/api/profile
echo.
echo.

echo 2. Testing Login Endpoint...
curl -X POST %BASE_URL%/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
echo.
echo.

echo 3. Testing Public Endpoints...
echo.

echo Testing GET /api/skills...
curl -s -o NUL -w "HTTP Status: %%{http_code}" %BASE_URL%/api/skills
echo.

echo Testing GET /api/experiences...
curl -s -o NUL -w "HTTP Status: %%{http_code}" %BASE_URL%/api/experiences
echo.

echo Testing GET /api/projects...
curl -s -o NUL -w "HTTP Status: %%{http_code}" %BASE_URL%/api/projects
echo.

echo Testing GET /api/blogs...
curl -s -o NUL -w "HTTP Status: %%{http_code}" %BASE_URL%/api/blogs
echo.

echo Testing GET /api/profile...
curl -s -o NUL -w "HTTP Status: %%{http_code}" %BASE_URL%/api/profile
echo.
echo.

echo 4. Testing Admin Endpoint Without Auth (Should Return 401)...
curl -s -o NUL -w "HTTP Status: %%{http_code}" -X POST %BASE_URL%/api/skills ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"category\":\"test\",\"proficiency\":50}"
echo.
echo.

echo ==================================
echo Test Suite Complete!
echo ==================================
echo.
echo For full testing, please:
echo 1. Copy the JWT token from step 2
echo 2. Use Postman or similar tool to test admin endpoints
echo 3. Include token in Authorization header: Bearer YOUR_TOKEN
echo.

pause
