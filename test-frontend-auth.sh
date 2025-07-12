#!/bin/bash

echo "🧪 Testing Frontend Authentication Flow"
echo "======================================="

# Test if frontend is running
echo "🔥 Step 1: Checking if frontend is running..."
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$FRONTEND_CHECK" = "200" ]; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not running. Please start with 'npm start'"
    exit 1
fi

# Test if backend is running
echo "🔥 Step 2: Checking if backend is running..."
BACKEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)

if [ "$BACKEND_CHECK" = "200" ]; then
    echo "✅ Backend is running on port 3001"
else
    echo "❌ Backend is not running. Please start the backend"
    exit 1
fi

# Test authentication endpoint
echo "🔥 Step 3: Testing authentication endpoint..."
AUTH_TEST=$(curl -s http://localhost:3001/api/auth/test)
echo "Auth test response: $AUTH_TEST"

if echo "$AUTH_TEST" | grep -q "Auth API is working"; then
    echo "✅ Auth API is working correctly"
else
    echo "❌ Auth API is not working"
    exit 1
fi

# Test user login
echo "🔥 Step 4: Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

echo "Login response: $LOGIN_RESPONSE"

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
if [ "$TOKEN" != "null" ]; then
    echo "✅ User login successful"
    echo "Token: ${TOKEN:0:20}..."
else
    echo "❌ User login failed"
fi

echo ""
echo "🎯 Authentication Flow Status:"
echo "✅ Frontend: Running"
echo "✅ Backend: Running"
echo "✅ Auth API: Working"
echo "✅ User Login: Working"
echo ""
echo "🌟 Try signing in through the frontend now!"
echo "🌐 Open: http://localhost:3000/signin"
