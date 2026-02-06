#!/bin/bash

# Spring Boot Backend API Test Script
# This script tests all major endpoints of the portfolio backend

BASE_URL="http://localhost:8080"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================="
echo "Portfolio Backend API Test Script"
echo "=================================="
echo ""

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
    fi
}

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Backend Health...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/profile)
if [ $response -eq 200 ] || [ $response -eq 404 ]; then
    print_result 0 "Backend is running"
else
    print_result 1 "Backend is not responding (HTTP $response)"
    echo "Make sure the backend is running: cd backend && mvn spring-boot:run"
    exit 1
fi
echo ""

# Test 2: Login
echo -e "${YELLOW}2. Testing Login Endpoint...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    print_result 0 "Login successful"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token received: ${TOKEN:0:50}..."
else
    print_result 1 "Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Public Endpoints
echo -e "${YELLOW}3. Testing Public Endpoints...${NC}"

# Test Skills
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/skills)
[ $response -eq 200 ] && print_result 0 "GET /api/skills" || print_result 1 "GET /api/skills (HTTP $response)"

# Test Experiences
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/experiences)
[ $response -eq 200 ] && print_result 0 "GET /api/experiences" || print_result 1 "GET /api/experiences (HTTP $response)"

# Test Projects
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/projects)
[ $response -eq 200 ] && print_result 0 "GET /api/projects" || print_result 1 "GET /api/projects (HTTP $response)"

# Test Blogs
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/blogs)
[ $response -eq 200 ] && print_result 0 "GET /api/blogs" || print_result 1 "GET /api/blogs (HTTP $response)"

# Test Profile
response=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/profile)
[ $response -eq 200 ] || [ $response -eq 404 ] && print_result 0 "GET /api/profile" || print_result 1 "GET /api/profile (HTTP $response)"

echo ""

# Test 4: Admin Endpoints Without Auth (Should Fail)
echo -e "${YELLOW}4. Testing Admin Endpoints Without Auth (Should Return 401)...${NC}"

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST ${BASE_URL}/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","category":"test","proficiency":50}')
[ $response -eq 401 ] && print_result 0 "POST /api/skills without auth returns 401" || print_result 1 "POST /api/skills without auth (HTTP $response)"

echo ""

# Test 5: Admin Endpoints With Auth (Should Succeed)
echo -e "${YELLOW}5. Testing Admin Endpoints With Auth...${NC}"

# Create Skill
CREATE_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Skill",
    "icon": "fa-solid fa-test",
    "category": "test",
    "proficiency": 85,
    "sortOrder": 100
  }')

if echo "$CREATE_RESPONSE" | grep -q "Test Skill"; then
    print_result 0 "POST /api/skills with auth"
    SKILL_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "Created skill with ID: $SKILL_ID"

    # Update Skill
    if [ ! -z "$SKILL_ID" ]; then
        UPDATE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT ${BASE_URL}/api/skills/$SKILL_ID \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Updated Test Skill",
            "category": "test",
            "proficiency": 90,
            "sortOrder": 100
          }')
        [ $UPDATE_RESPONSE -eq 200 ] && print_result 0 "PUT /api/skills/{id} with auth" || print_result 1 "PUT /api/skills/{id} (HTTP $UPDATE_RESPONSE)"

        # Delete Skill
        DELETE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE ${BASE_URL}/api/skills/$SKILL_ID \
          -H "Authorization: Bearer $TOKEN")
        [ $DELETE_RESPONSE -eq 204 ] && print_result 0 "DELETE /api/skills/{id} with auth" || print_result 1 "DELETE /api/skills/{id} (HTTP $DELETE_RESPONSE)"
    fi
else
    print_result 1 "POST /api/skills with auth"
    echo "Response: $CREATE_RESPONSE"
fi

echo ""

# Test 6: Contact Form (Public)
echo -e "${YELLOW}6. Testing Contact Form Submission (Public)...${NC}"

CONTACT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST ${BASE_URL}/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message from the API test script."
  }')

[ $CONTACT_RESPONSE -eq 201 ] && print_result 0 "POST /api/contacts (public)" || print_result 1 "POST /api/contacts (HTTP $CONTACT_RESPONSE)"

echo ""

# Test 7: View Contacts (Admin)
echo -e "${YELLOW}7. Testing View Contacts (Admin)...${NC}"

response=$(curl -s -o /dev/null -w "%{http_code}" -X GET ${BASE_URL}/api/contacts \
  -H "Authorization: Bearer $TOKEN")
[ $response -eq 200 ] && print_result 0 "GET /api/contacts with auth" || print_result 1 "GET /api/contacts (HTTP $response)"

echo ""

# Summary
echo "=================================="
echo -e "${GREEN}Test Suite Complete!${NC}"
echo "=================================="
echo ""
echo "If all tests passed, your backend is working correctly!"
echo ""
echo "Next steps:"
echo "1. Start the Angular frontend: ng serve"
echo "2. Open http://localhost:4200 in your browser"
echo "3. Test the full application flow"
echo ""
