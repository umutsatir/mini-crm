# 🧪 Backend API Testing Guide

This guide helps you test the MiniCRM backend API endpoints.

## 🚀 Quick Test Commands

### 1. Test Backend is Running

```bash
# Test if backend responds
curl http://localhost/minicrm/backend/

# Expected response: {"authenticated":false} (if not logged in)
```

### 2. Test User Registration

```bash
curl -X POST http://localhost/minicrm/backend/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected response: {"message":"User registered successfully","user":{...},"token":"..."}
```

### 3. Test User Login

```bash
curl -X POST http://localhost/minicrm/backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Expected response: {"message":"Login successful","user":{...},"token":"..."}
```

### 4. Test Authentication Check (with token)

```bash
# First get a token from login, then use it:
curl http://localhost/minicrm/backend/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected response: {"authenticated":true,"user":{...},"token":"..."}
```

### 5. Test Get Customers (with token)

```bash
curl http://localhost:8000/minicrm/backend/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected response: {"customers":[...]}
```

### 6. Test Create Customer (with token)

```bash
curl -X POST http://localhost:8000/minicrm/backend/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe",
    "phone": "905551234567",
    "tags": "VIP, Regular",
    "notes": "Test customer",
    "follow_up_date": "2024-01-20"
  }'

# Expected response: {"message":"Customer created successfully","customer":{...}}
```

### 7. Test Get Today's Follow-ups (with token)

```bash
curl http://localhost:8000/minicrm/backend/api/customers/followups \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected response: {"followups":[...],"date":"2024-01-XX"}
```

## 🔧 Complete Test Script

Here's a complete test script you can run:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000/minicrm/backend"
EMAIL="test@example.com"
PASSWORD="password123"

echo "🧪 Testing MiniCRM Backend API"
echo "================================"

# Test 1: Check if backend is running
echo "1. Testing backend availability..."
response=$(curl -s "$BASE_URL/")
echo "Response: $response"
echo ""

# Test 2: Register new user
echo "2. Testing user registration..."
response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $response"
echo ""

# Test 3: Login
echo "3. Testing user login..."
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $response"
echo ""

# Extract token from login response
TOKEN=$(echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# Test 4: Check authentication with token
echo "4. Testing authentication check..."
response=$(curl -s "$BASE_URL/" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $response"
echo ""

# Test 5: Get customers
echo "5. Testing get customers..."
response=$(curl -s "$BASE_URL/api/customers" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $response"
echo ""

# Test 6: Create customer
echo "6. Testing create customer..."
response=$(curl -s -X POST "$BASE_URL/api/customers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Customer",
    "phone": "905551234567",
    "tags": "Test, VIP",
    "notes": "This is a test customer",
    "follow_up_date": "2024-01-20"
  }')
echo "Response: $response"
echo ""

# Test 7: Get follow-ups
echo "7. Testing get follow-ups..."
response=$(curl -s "$BASE_URL/api/customers/followups" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $response"
echo ""

echo "✅ Backend testing completed!"
```

## 🐛 Troubleshooting

### Common Issues:

1. **Connection refused**:

    ```bash
    # Check if backend is running
    curl http://localhost:8000/minicrm/backend/
    ```

2. **CORS errors**:

    - Check if CORS headers are set in SecurityHelper.php
    - Verify the frontend URL is allowed

3. **Database connection errors**:

    ```bash
    # Check if .env file exists and has correct database settings
    cat ~/Sites/mini-crm/backend/.env
    ```

4. **JWT token errors**:
    - Make sure JWT_SECRET is set in .env file
    - Check if token format is correct: `Bearer <token>`

### Debug Commands:

```bash
# Check if backend files exist
ls -la ~/Sites/mini-crm/backend/

# Check if .env file exists
ls -la ~/Sites/mini-crm/backend/.env

# Check PHP errors
tail -f /var/log/apache2/error.log

# Test database connection
mysql -u your_username -p -e "USE minicrm; SELECT * FROM users;"
```

## ✅ Expected Responses

### Successful Registration:

```json
{
    "message": "User registered successfully",
    "user": {
        "id": 3,
        "name": "Test User",
        "email": "test@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Successful Login:

```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Customers List:

```json
{
    "customers": [
        {
            "id": 1,
            "name": "Alice Johnson",
            "phone": "905551234567",
            "tags": "VIP, Regular",
            "notes": "Interested in premium package",
            "follow_up_date": "2024-01-15",
            "whatsapp_link": "https://wa.me/905551234567"
        }
    ]
}
```

## 🎯 Quick Test

Run this single command to test if your backend is working:

```bash
curl -X POST http://localhost:8000/minicrm/backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

If you get a JSON response with a token, your backend is working! 🎉
