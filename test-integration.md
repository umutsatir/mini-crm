# 🧪 MiniCRM Integration Test Guide

This guide helps you test that the frontend and backend are properly integrated.

## Prerequisites

1. **Backend Setup**:

    ```bash
    cd ~/Sites/mini-crm/backend
    # Create .env file from env.example
    cp env.example .env
    # Edit .env with your database credentials
    # Make sure your web server (Apache/Nginx) is configured to serve from ~/Sites/mini-crm
    # Access via: http://localhost/minicrm/backend
    ```

2. **Frontend Setup**:

    ```bash
    cd ~/Sites/mini-crm/frontend
    npm install
    npm run dev
    ```

3. **Database Setup**:
    ```bash
    # Create database
    mysql -u your_username -p -e "CREATE DATABASE minicrm;"
    # Import schema
    mysql -u your_username -p minicrm < ~/Sites/mini-crm/backend/database.sql
    ```

## 🧪 Test Cases

### 1. Authentication Flow

**Test Registration**:

1. Open http://localhost:5173
2. Click "Sign up"
3. Fill in: Name, Email, Password (min 6 chars)
4. Click "Sign up"
5. ✅ Should redirect to dashboard

**Test Login**:

1. Use default credentials: `john@example.com` / `password123`
2. Click "Sign in"
3. ✅ Should redirect to dashboard

**Test Logout**:

1. Click "Logout" button
2. ✅ Should redirect to login page

### 2. Customer Management

**Test Add Customer**:

1. Click "Add Customer" button
2. Fill in: Name, Phone, Tags, Notes, Follow-up Date
3. Click "Add Customer"
4. ✅ Should appear in customer list

**Test Edit Customer**:

1. Click edit icon on any customer card
2. Modify fields
3. Click "Update Customer"
4. ✅ Should show updated information

**Test Delete Customer**:

1. Click delete icon on any customer card
2. Confirm deletion
3. ✅ Should remove from list

**Test Search**:

1. Type in search box
2. ✅ Should filter customers by name, phone, or tags

### 3. Follow-up Tracking

**Test Today's Follow-ups**:

1. Add a customer with today's date as follow-up
2. ✅ Should appear in "Today's Follow-Ups" section

**Test WhatsApp Integration**:

1. Click "Message" button on any customer
2. ✅ Should open WhatsApp with pre-filled phone number

### 4. Error Handling

**Test Invalid Login**:

1. Try login with wrong credentials
2. ✅ Should show error message

**Test Form Validation**:

1. Try to add customer without required fields
2. ✅ Should show validation errors

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:

    - Check that backend is running on port 8000
    - Verify CORS headers in SecurityHelper.php

2. **Database Connection**:

    - Check .env file configuration
    - Verify MySQL is running
    - Test database connection manually

3. **API Errors**:

    - Check browser console for network errors
    - Verify API endpoints in backend/index.php
    - Check PHP error logs

4. **Authentication Issues**:
    - Clear browser localStorage
    - Check JWT token generation
    - Verify AuthMiddleware is working

### Debug Steps

1. **Backend Debug**:

    ```bash
    # Check PHP errors
    tail -f /var/log/apache2/error.log  # or your PHP error log

             # Test API directly
    curl -X POST http://localhost/minicrm/backend/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
    ```

2. **Frontend Debug**:

    - Open browser DevTools
    - Check Network tab for API calls
    - Check Console for JavaScript errors

3. **Database Debug**:

    ```sql
    -- Check if users exist
    SELECT * FROM users;

    -- Check if customers exist
    SELECT * FROM customers;
    ```

## ✅ Success Criteria

The integration is successful if:

-   [ ] Users can register and login
-   [ ] Authentication state persists across page reloads
-   [ ] Users can add, edit, and delete customers
-   [ ] Customer data is user-scoped (users only see their own customers)
-   [ ] Today's follow-ups section works correctly
-   [ ] WhatsApp links open with correct phone numbers
-   [ ] Search functionality works
-   [ ] Form validation works
-   [ ] Error messages are displayed properly
-   [ ] No CORS errors in browser console

## 🚀 Next Steps

Once integration is verified:

1. **Polish & QA**: Address any UI/UX issues
2. **Security Review**: Test for common vulnerabilities
3. **Performance**: Optimize database queries and frontend rendering
4. **Deployment**: Prepare for production deployment
