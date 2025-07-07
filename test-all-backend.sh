#!/bin/bash

# MiniCRM Backend Complete Test Script
BASE_URL="http://localhost/mini-crm/backend"
TEST_EMAIL="testuser@test4.com"
TEST_PASSWORD="password123"
TOKEN=""

echo "🧪 MiniCRM Backend Complete Test Suite"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Check if backend is running
echo "1. Testing backend availability..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Backend is running"
    echo "   Response: $response_body"
else
    print_status 1 "Backend is not responding (HTTP $http_code)"
    echo "   Response: $response_body"
    exit 1
fi
echo ""

# Test 2: Register new user
echo "2. Testing user registration..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "User registration successful"
    echo "   Response: $response_body"
    # Extract token for later use
    TOKEN=$(echo $response_body | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_status 1 "User registration failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 3: Login with existing user
echo "3. Testing user login..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "User login successful"
    echo "   Response: $response_body"
    # Extract token for later use
    TOKEN=$(echo $response_body | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:50}..."
else
    print_status 1 "User login failed (HTTP $http_code)"
    echo "   Response: $response_body"
    exit 1
fi
echo ""

# Test 4: Check authentication with token
echo "4. Testing authentication check..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/" \
  -H "Authorization: Bearer $TOKEN")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Authentication check successful"
    echo "   Response: $response_body"
else
    print_status 1 "Authentication check failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 5: Get customers (should be empty for new user)
echo "5. Testing get customers..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/customers" \
  -H "Authorization: Bearer $TOKEN")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Get customers successful"
    echo "   Response: $response_body"
else
    print_status 1 "Get customers failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 6: Create customer
echo "6. Testing create customer..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/customers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Customer",
    "phone": "905551234567",
    "tags": "Test, VIP",
    "notes": "This is a test customer created by the test script",
    "follow_up_date": "2024-01-20"
  }')
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "201" ]; then
    print_status 0 "Create customer successful"
    echo "   Response: $response_body"
    # Extract customer ID for later use
    CUSTOMER_ID=$(echo $response_body | grep -o '"id":[0-9]*' | cut -d':' -f2)
else
    print_status 1 "Create customer failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 7: Get customers again (should now have one customer)
echo "7. Testing get customers (after creation)..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/customers" \
  -H "Authorization: Bearer $TOKEN")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Get customers successful"
    echo "   Response: $response_body"
else
    print_status 1 "Get customers failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 8: Get specific customer
if [ ! -z "$CUSTOMER_ID" ]; then
    echo "8. Testing get specific customer..."
    response=$(curl -s -w "%{http_code}" "$BASE_URL/api/customers/$CUSTOMER_ID" \
      -H "Authorization: Bearer $TOKEN")
    http_code="${response: -3}"
    response_body="${response%???}"

    if [ "$http_code" = "200" ]; then
        print_status 0 "Get specific customer successful"
        echo "   Response: $response_body"
    else
        print_status 1 "Get specific customer failed (HTTP $http_code)"
        echo "   Response: $response_body"
    fi
    echo ""
fi

# Test 9: Update customer
if [ ! -z "$CUSTOMER_ID" ]; then
    echo "9. Testing update customer..."
    response=$(curl -s -w "%{http_code}" -X PUT "$BASE_URL/api/customers/$CUSTOMER_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "name": "Updated Test Customer",
        "phone": "905559876543",
        "tags": "Updated, VIP",
        "notes": "This customer was updated by the test script",
        "follow_up_date": "2024-01-25"
      }')
    http_code="${response: -3}"
    response_body="${response%???}"

    if [ "$http_code" = "200" ]; then
        print_status 0 "Update customer successful"
        echo "   Response: $response_body"
    else
        print_status 1 "Update customer failed (HTTP $http_code)"
        echo "   Response: $response_body"
    fi
    echo ""
fi

# Test 10: Get follow-ups
echo "10. Testing get follow-ups..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/customers/followups" \
  -H "Authorization: Bearer $TOKEN")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Get follow-ups successful"
    echo "   Response: $response_body"
else
    print_status 1 "Get follow-ups failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 11: Get follow-ups with specific date
echo "11. Testing get follow-ups with specific date..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/customers/followups?date=2024-01-20" \
  -H "Authorization: Bearer $TOKEN")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Get follow-ups with date successful"
    echo "   Response: $response_body"
else
    print_status 1 "Get follow-ups with date failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 12: Delete customer
if [ ! -z "$CUSTOMER_ID" ]; then
    echo "12. Testing delete customer..."
    response=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/api/customers/$CUSTOMER_ID" \
      -H "Authorization: Bearer $TOKEN")
    http_code="${response: -3}"
    response_body="${response%???}"

    if [ "$http_code" = "200" ]; then
        print_status 0 "Delete customer successful"
        echo "   Response: $response_body"
    else
        print_status 1 "Delete customer failed (HTTP $http_code)"
        echo "   Response: $response_body"
    fi
    echo ""
fi

# Test 13: Test invalid login
echo "13. Testing invalid login..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid@example.com","password":"wrongpassword"}')
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "401" ]; then
    print_status 0 "Invalid login correctly rejected"
    echo "   Response: $response_body"
else
    print_status 1 "Invalid login not properly handled (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 14: Test unauthorized access
echo "14. Testing unauthorized access..."
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/customers")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "401" ]; then
    print_status 0 "Unauthorized access correctly rejected"
    echo "   Response: $response_body"
else
    print_status 1 "Unauthorized access not properly handled (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

# Test 15: Test logout
echo "15. Testing logout..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/logout" \
  -H "Authorization: Bearer $TOKEN")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_status 0 "Logout successful"
    echo "   Response: $response_body"
else
    print_status 1 "Logout failed (HTTP $http_code)"
    echo "   Response: $response_body"
fi
echo ""

echo "🎉 Backend testing completed!"
echo "============================="
echo ""
echo "Summary:"
echo "- All endpoints tested"
echo "- Authentication flow verified"
echo "- CRUD operations tested"
echo "- Error handling verified"
echo ""
echo "If all tests passed, your backend is working correctly! 🚀" 