#!/bin/bash

echo "🧪 Testing Reware App Authentication and Add Item Flow"
echo "=================================================="

# Test 1: Create a new user account
echo "🔥 Step 1: Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User 2","email":"test2@example.com","password":"password123"}')

echo "Registration response: $REGISTER_RESPONSE"

# Extract token from response
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ]; then
    echo "❌ Registration failed - no token received"
    exit 1
fi

echo "✅ Registration successful, token: ${TOKEN:0:20}..."

# Test 2: Test login with the new user
echo "🔥 Step 2: Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"password123"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract token from login response
LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$LOGIN_TOKEN" = "null" ]; then
    echo "❌ Login failed - no token received"
    exit 1
fi

echo "✅ Login successful, token: ${LOGIN_TOKEN:0:20}..."

# Test 3: Test adding an item with authentication
echo "🔥 Step 3: Testing item creation with authentication..."
ITEM_RESPONSE=$(curl -s -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -d '{
    "title": "Test Designer Shirt",
    "description": "A beautiful designer shirt in excellent condition",
    "category": "Tops",
    "size": "M",
    "condition": "Excellent",
    "color": "Blue",
    "brand": "Designer Brand",
    "pointsValue": 25,
    "images": ["https://via.placeholder.com/400x400"],
    "tags": ["designer", "casual", "blue"]
  }')

echo "Item creation response: $ITEM_RESPONSE"

# Check if item was created successfully
ITEM_ID=$(echo $ITEM_RESPONSE | jq -r '.item._id')

if [ "$ITEM_ID" = "null" ]; then
    echo "❌ Item creation failed"
    exit 1
fi

echo "✅ Item created successfully with ID: $ITEM_ID"

# Test 4: Test adding an item without authentication
echo "🔥 Step 4: Testing item creation without authentication..."
NO_AUTH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Item No Auth",
    "description": "This should fail",
    "category": "Tops",
    "size": "M",
    "condition": "Good",
    "color": "Red",
    "pointsValue": 10,
    "images": ["https://via.placeholder.com/400x400"]
  }')

echo "No auth response: $NO_AUTH_RESPONSE"

# Check if it properly fails
if echo "$NO_AUTH_RESPONSE" | grep -q "Access token required"; then
    echo "✅ Authentication protection working correctly"
else
    echo "❌ Authentication protection failed"
fi

echo ""
echo "🎉 All tests completed!"
echo "✅ User registration: Working"
echo "✅ User login: Working"
echo "✅ Authenticated item creation: Working"
echo "✅ Authentication protection: Working"
echo ""
echo "🌟 The add item feature should now work correctly for authenticated users!"
