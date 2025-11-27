import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Item from './models/Item.js';
import Swap from './models/Swap.js';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    bio: 'Fashion enthusiast who loves sustainable shopping',
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    stats: {
      totalSwaps: 12,
      rating: 4.8,
      totalPoints: 250
    },
    points: 250
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    bio: 'Minimalist looking to exchange quality pieces',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    stats: {
      totalSwaps: 8,
      rating: 4.6,
      totalPoints: 180
    },
    points: 180
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'password123',
    bio: 'Vintage lover and eco-conscious shopper',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    },
    stats: {
      totalSwaps: 15,
      rating: 4.9,
      totalPoints: 320
    },
    points: 320
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'password123',
    bio: 'Streetwear collector and sustainability advocate',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    },
    stats: {
      totalSwaps: 5,
      rating: 4.4,
      totalPoints: 150
    },
    points: 150
  }
];

const sampleItems = [
  {
    title: 'Vintage Denim Jacket',
    description: 'Classic 90s denim jacket in excellent condition. Perfect for layering!',
    category: 'Outerwear',
    size: 'M',
    condition: 'Good',
    color: 'Blue',
    brand: 'Levi\'s',
    pointsValue: 45,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['vintage', 'denim', 'casual'],
    views: 23,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Floral Summer Dress',
    description: 'Beautiful floral print dress, perfect for summer occasions',
    category: 'Dresses',
    size: 'S',
    condition: 'Excellent',
    color: 'Multicolor',
    brand: 'Zara',
    pointsValue: 35,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['floral', 'summer', 'dress'],
    views: 18,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Black Leather Boots',
    description: 'Genuine leather boots in great condition. Comfortable and stylish.',
    category: 'Shoes',
    size: '8',
    condition: 'Good',
    color: 'Black',
    brand: 'Dr. Martens',
    pointsValue: 55,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['leather', 'boots', 'black'],
    views: 31,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Cozy Knit Sweater',
    description: 'Soft wool blend sweater, perfect for chilly days',
    category: 'Tops',
    size: 'L',
    condition: 'Excellent',
    color: 'Beige',
    brand: 'H&M',
    pointsValue: 40,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['cozy', 'knit', 'sweater'],
    views: 15,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Designer Handbag',
    description: 'Authentic designer handbag in mint condition',
    category: 'Accessories',
    size: 'One Size',
    condition: 'Excellent',
    color: 'Brown',
    brand: 'Coach',
    pointsValue: 30,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['designer', 'handbag', 'luxury'],
    views: 42,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Slim Fit Jeans',
    description: 'Dark wash slim fit jeans, barely worn',
    category: 'Bottoms',
    size: '32',
    condition: 'Good',
    color: 'Dark Blue',
    brand: 'Levi\'s',
    pointsValue: 65,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['jeans', 'slim', 'denim'],
    views: 28,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Casual T-Shirt',
    description: 'Comfortable cotton t-shirt in great condition',
    category: 'Tops',
    size: 'M',
    condition: 'Good',
    color: 'White',
    brand: 'Uniqlo',
    pointsValue: 25,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['casual', 'tshirt', 'cotton'],
    views: 12,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Winter Coat',
    description: 'Warm winter coat with down filling',
    category: 'Outerwear',
    size: 'L',
    condition: 'Good',
    color: 'Navy',
    brand: 'North Face',
    pointsValue: 50,
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['winter', 'coat', 'warm'],
    views: 19,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Summer Sandals',
    description: 'Comfortable leather sandals for summer',
    category: 'Shoes',
    size: '7',
    condition: 'Fair',
    color: 'Tan',
    brand: 'Birkenstock',
    pointsValue: 35,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['sandals', 'summer', 'comfort'],
    views: 25,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Formal Blazer',
    description: 'Professional blazer for business occasions',
    category: 'Outerwear',
    size: 'M',
    condition: 'Excellent',
    color: 'Black',
    brand: 'Hugo Boss',
    pointsValue: 42,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['blazer', 'formal', 'business'],
    views: 16,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Silk Scarf',
    description: 'Luxurious silk scarf with beautiful pattern',
    category: 'Accessories',
    size: 'One Size',
    condition: 'Excellent',
    color: 'Red',
    brand: 'Hermès',
    pointsValue: 38,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['silk', 'scarf', 'luxury'],
    views: 21,
    likes: [],
    isAvailable: true
  },
  {
    title: 'Running Shoes',
    description: 'Lightweight running shoes in good condition',
    category: 'Shoes',
    size: '9',
    condition: 'Good',
    color: 'Gray',
    brand: 'Nike',
    pointsValue: 45,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    tags: ['running', 'shoes', 'athletic'],
    views: 33,
    likes: [],
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-exchange', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    await Swap.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create items with random user assignments
    const itemsWithUsers = sampleItems.map((item, index) => ({
      ...item,
      userId: createdUsers[index % createdUsers.length]._id,
      location: createdUsers[index % createdUsers.length].location
    }));

    const createdItems = await Item.create(itemsWithUsers);
    console.log(`Created ${createdItems.length} items`);

    // Add some random likes
    for (let i = 0; i < createdItems.length; i++) {
      const item = createdItems[i];
      const numLikes = Math.floor(Math.random() * 5); // 0-4 likes per item
      const likers = [];
      
      for (let j = 0; j < numLikes; j++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (!likers.includes(randomUser._id.toString()) && randomUser._id.toString() !== item.userId.toString()) {
          likers.push(randomUser._id);
        }
      }
      
      await Item.findByIdAndUpdate(item._id, { likes: likers });
    }

    console.log('Added random likes to items');

    // Create some sample swaps
    const sampleSwaps = [
      {
        requesterId: createdUsers[0]._id,
        ownerId: createdUsers[1]._id,
        requesterItemId: createdItems[0]._id,
        ownerItemId: createdItems[1]._id,
        status: 'pending',
        message: 'Hi! I love your floral dress. Would you be interested in swapping for my vintage denim jacket?'
      },
      {
        requesterId: createdUsers[2]._id,
        ownerId: createdUsers[3]._id,
        requesterItemId: createdItems[2]._id,
        ownerItemId: createdItems[3]._id,
        status: 'accepted',
        message: 'These sneakers would be perfect for my morning runs!'
      },
      {
        requesterId: createdUsers[1]._id,
        ownerId: createdUsers[0]._id,
        requesterItemId: createdItems[4]._id,
        ownerItemId: createdItems[5]._id,
        status: 'completed',
        message: 'I\'ve been looking for a bag like this forever!',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        rating: {
          requesterRating: 5,
          ownerRating: 4
        }
      }
    ];

    await Swap.create(sampleSwaps);
    console.log('Created sample swaps');

    console.log('Database seeded successfully! 🎉');
    console.log('\nSample user credentials:');
    sampleUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Password: ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
