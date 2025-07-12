#!/bin/bash

echo "Testing API connection..."

# Test health endpoint
echo "1. Testing health endpoint:"
curl -s http://localhost:5001/health | head -5

echo ""
echo ""

# Test items endpoint  
echo "2. Testing items endpoint:"
curl -s http://localhost:5001/api/items | head -5

echo ""
echo ""

# Test with different frontend port
echo "3. Testing CORS from frontend perspective:"
curl -s -H "Origin: http://localhost:3000" http://localhost:5001/api/items | head -5

echo ""
echo ""
echo "API test completed. If you see JSON data above, the API is working correctly."
