import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Swap from '../models/Swap.js';

const router = express.Router();

// Get user dashboard data
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's items
    const userItems = await Item.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's swaps
    const userSwaps = await Swap.find({
      $or: [{ requesterId: userId }, { ownerId: userId }]
    })
      .populate('requesterItemId', 'title images pointsValue')
      .populate('ownerItemId', 'title images pointsValue')
      .populate('requesterId', 'name profilePicture')
      .populate('ownerId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);

    // Separate ongoing and completed swaps
    const ongoingSwaps = userSwaps.filter(swap => 
      ['pending', 'accepted'].includes(swap.status)
    );
    const completedSwaps = userSwaps.filter(swap => 
      ['completed', 'declined', 'cancelled'].includes(swap.status)
    );

    // Calculate stats
    const stats = {
      totalPoints: user.points,
      totalItems: userItems.length,
      totalSwaps: userSwaps.length,
      ongoingSwaps: ongoingSwaps.length,
      completedSwaps: completedSwaps.length,
      successRate: userSwaps.length > 0 ? 
        (completedSwaps.filter(s => s.status === 'completed').length / userSwaps.length * 100).toFixed(1) : 0
    };

    res.json({
      user,
      items: userItems,
      swaps: {
        ongoing: ongoingSwaps,
        completed: completedSwaps
      },
      stats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's items with pagination
router.get('/items/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const query = { userId };
    if (status !== 'all') {
      query.isAvailable = status === 'available';
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Items fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's swaps with pagination
router.get('/swaps/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const query = {
      $or: [{ requesterId: userId }, { ownerId: userId }]
    };
    
    if (status !== 'all') {
      query.status = status;
    }

    const swaps = await Swap.find(query)
      .populate('requesterItemId', 'title images pointsValue category')
      .populate('ownerItemId', 'title images pointsValue category')
      .populate('requesterId', 'name profilePicture')
      .populate('ownerId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Swap.countDocuments(query);

    res.json({
      swaps,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Swaps fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, bio, location, preferences } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, location, preferences },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new item
router.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    // Update user's items count
    await User.findByIdAndUpdate(
      req.body.userId,
      { $inc: { 'stats.itemsListed': 1 } }
    );

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Item creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item
router.put('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Item update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item
router.delete('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update user's items count
    await User.findByIdAndUpdate(
      deletedItem.userId,
      { $inc: { 'stats.itemsListed': -1 } }
    );

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Item deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
