const axios = require('axios');

const testAddItem = async () => {
  try {
    console.log('Testing Add Item API...');
    
    // Test item data
    const testItem = {
      title: 'Test Item',
      description: 'This is a test item created via API',
      category: 'Tops',
      size: 'M',
      condition: 'Good',
      color: 'Blue',
      brand: 'Test Brand',
      pointsValue: 25,
      images: ['https://via.placeholder.com/400x400/blue/white?text=Test+Item'],
      tags: ['test', 'api'],
      userId: '507f1f77bcf86cd799439011', // Mock user ID
      location: { city: 'Test City', state: 'TS', country: 'USA' },
      views: 0,
      likes: [],
      isAvailable: true
    };

    // Make API call to add item
    const response = await axios.post('http://localhost:5000/api/items', testItem, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Add Item API Response:', response.data);
    console.log('✅ Item created successfully!');
    
    // Test getting all items
    const itemsResponse = await axios.get('http://localhost:5000/api/items');
    console.log('✅ Total items in database:', itemsResponse.data.items.length);
    
  } catch (error) {
    console.error('❌ Error testing Add Item API:', error.response?.data || error.message);
  }
};

testAddItem();
