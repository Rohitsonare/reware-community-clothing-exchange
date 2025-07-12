#!/bin/bash

# Test script for ReWare Community Clothing Exchange

echo "🧪 Testing ReWare API Endpoints"
echo "================================"

# Test health check
echo "1. Health Check:"
curl -s "http://localhost:5002/health" | jq -r '.status'

# Test items endpoint
echo "2. Items API:"
ITEM_COUNT=$(curl -s "http://localhost:5002/api/items?limit=5" | jq -r '.items | length')
echo "   Found $ITEM_COUNT items"

# Test search suggestions
echo "3. Search Suggestions:"
SUGGESTIONS=$(curl -s "http://localhost:5002/api/items/search/suggestions?q=vin" | jq -r 'length')
echo "   Found $SUGGESTIONS suggestions for 'vin'"

# Test categories
echo "4. Category Stats:"
CATEGORIES=$(curl -s "http://localhost:5002/api/items/categories/stats" | jq -r 'length')
echo "   Found $CATEGORIES categories"

# Test filters
echo "5. Filtered Items (Tops):"
TOPS=$(curl -s "http://localhost:5002/api/items?category=Tops&limit=10" | jq -r '.items | length')
echo "   Found $TOPS tops"

# Test pagination
echo "6. Pagination:"
TOTAL_ITEMS=$(curl -s "http://localhost:5002/api/items?limit=1" | jq -r '.pagination.totalItems')
echo "   Total items in database: $TOTAL_ITEMS"

echo ""
echo "✅ API tests completed!"
echo ""
echo "🌐 Frontend URLs:"
echo "   - Landing Page: http://localhost:3001"
echo "   - Items Page: http://localhost:3001/items"
echo "   - Sign In: http://localhost:3001/signin"
echo "   - Browse: http://localhost:3001/browse"
echo ""
echo "🔑 Test User Credentials:"
echo "   Email: alice@example.com"
echo "   Password: password123"
echo ""
echo "🎯 Key Features Implemented:"
echo "   ✅ Item listing with search & filters"
echo "   ✅ Advanced search with autocomplete"
echo "   ✅ Category filtering"
echo "   ✅ Pagination"
echo "   ✅ Like/Unlike functionality"
echo "   ✅ Detailed item view"
echo "   ✅ User authentication"
echo "   ✅ Responsive design"
echo "   ✅ Real-time UI updates"
echo ""
echo "📱 Mobile-first responsive design"
echo "🎨 Material-UI components"
echo "🔍 Real-time search with debouncing"
echo "💾 MongoDB with indexed collections"
echo "🚀 RESTful API with proper error handling"
