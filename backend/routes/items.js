import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new item
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      size,
      condition,
      color,
      brand,
      pointsValue,
      images,
      tags,
      userId,
      location
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !size || !condition || !pointsValue || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, category, size, condition, pointsValue, userId' 
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate points value
    if (pointsValue <= 0 || pointsValue > 1000) {
      return res.status(400).json({ error: 'Points value must be between 1 and 1000' });
    }

    // Validate images
    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Create new item
    const newItem = new Item({
      title: title.trim(),
      description: description.trim(),
      category,
      size,
      condition,
      color: color?.trim() || '',
      brand: brand?.trim() || '',
      pointsValue: parseInt(pointsValue),
      images,
      tags: tags || [],
      userId,
      location: location || user.location || { city: 'Unknown', state: 'Unknown', country: 'USA' },
      views: 0,
      likes: [],
      isAvailable: true
    });

    const savedItem = await newItem.save();
    
    // Update user's item count
    await User.findByIdAndUpdate(userId, { 
      $inc: { 'stats.itemsListed': 1 } 
    });

    // Populate user data for response
    const populatedItem = await Item.findById(savedItem._id)
      .populate('userId', 'name email location stats avatar');

    res.status(201).json({
      message: 'Item created successfully',
      item: populatedItem
    });

  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Get all items with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      condition,
      minPoints,
      maxPoints,
      color,
      brand,
      search,
      sortBy = 'newest',
      location,
      isAvailable = true
    } = req.query;

    // Build query object
    const query = {};
    
    // Handle isAvailable filter
    if (isAvailable === 'false') {
      query.isAvailable = false;
    } else {
      query.isAvailable = true; // Default to showing only available items
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Size filter
    if (size && size !== 'all') {
      query.size = size;
    }

    // Condition filter
    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    // Points range filter
    if (minPoints || maxPoints) {
      query.pointsValue = {};
      if (minPoints) query.pointsValue.$gte = parseInt(minPoints);
      if (maxPoints) query.pointsValue.$lte = parseInt(maxPoints);
    }

    // Color filter
    if (color) {
      query.color = new RegExp(color, 'i');
    }

    // Brand filter
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      ];
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') }
      ];
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'pointsLowToHigh':
        sortOptions = { pointsValue: 1 };
        break;
      case 'pointsHighToLow':
        sortOptions = { pointsValue: -1 };
        break;
      case 'mostViewed':
        sortOptions = { views: -1 };
        break;
      case 'mostLiked':
        sortOptions = { 'likes.length': -1 };
        break;
      case 'alphabetical':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const items = await Item.find(query)
      .populate('userId', 'name email location stats')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    // Get filter counts for UI
    const filterCounts = await Item.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          categories: { $addToSet: '$category' },
          sizes: { $addToSet: '$size' },
          conditions: { $addToSet: '$condition' },
          colors: { $addToSet: '$color' },
          brands: { $addToSet: '$brand' },
          minPoints: { $min: '$pointsValue' },
          maxPoints: { $max: '$pointsValue' }
        }
      }
    ]);

    res.json({
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: filterCounts[0] || {},
      appliedFilters: {
        category,
        size,
        condition,
        minPoints,
        maxPoints,
        color,
        brand,
        search,
        sortBy,
        location
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    // Increment view count
    const item = await Item.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('userId', 'name email location stats avatar');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Get similar items (same category, different owner)
    const similarItems = await Item.find({
      _id: { $ne: id },
      category: item.category,
      userId: { $ne: item.userId._id },
      isAvailable: true
    })
    .populate('userId', 'name location')
    .limit(4)
    .sort({ createdAt: -1 });

    res.json({
      item,
      similarItems
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Like/Unlike item
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const isLiked = item.likes.includes(userId);

    if (isLiked) {
      // Unlike
      item.likes = item.likes.filter(like => like.toString() !== userId);
    } else {
      // Like
      item.likes.push(userId);
    }

    await item.save();

    res.json({
      message: isLiked ? 'Item unliked' : 'Item liked',
      isLiked: !isLiked,
      likesCount: item.likes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Redeem item via points
router.post('/:id/redeem', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ error: 'Item is not available for redemption' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.points < item.pointsValue) {
      return res.status(400).json({ 
        error: `Insufficient points. You need ${item.pointsValue - user.points} more points.` 
      });
    }

    // Deduct points from user
    user.points -= item.pointsValue;
    await user.save();

    // Mark item as unavailable
    item.isAvailable = false;
    await item.save();

    // Add points to the item owner
    const itemOwner = await User.findById(item.userId);
    if (itemOwner) {
      itemOwner.points += item.pointsValue;
      await itemOwner.save();
    }

    res.json({
      message: 'Item redeemed successfully',
      remainingPoints: user.points,
      redeemedItem: {
        id: item._id,
        title: item.title,
        pointsValue: item.pointsValue
      }
    });
  } catch (error) {
    console.error('Error redeeming item:', error);
    res.status(500).json({ error: 'Failed to redeem item' });
  }
});

// Get featured items
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await Item.find({
      isAvailable: true,
      views: { $gte: 10 } // Items with at least 10 views
    })
    .populate('userId', 'name location')
    .sort({ views: -1, likes: -1 })
    .limit(8);

    res.json(featuredItems);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    res.status(500).json({ error: 'Failed to fetch featured items' });
  }
});

// Get categories with counts
router.get('/categories/stats', async (req, res) => {
  try {
    const categoryStats = await Item.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPoints: { $avg: '$pointsValue' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: 'Failed to fetch category stats' });
  }
});

// Search suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Search in titles, brands, and tags
    const suggestions = await Item.aggregate([
      {
        $match: {
          isAvailable: true,
          $or: [
            { title: new RegExp(q, 'i') },
            { brand: new RegExp(q, 'i') },
            { tags: new RegExp(q, 'i') }
          ]
        }
      },
      {
        $project: {
          title: 1,
          brand: 1,
          category: 1,
          image: { $arrayElemAt: ['$images', 0] }
        }
      },
      { $limit: 10 }
    ]);

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

export default router;
