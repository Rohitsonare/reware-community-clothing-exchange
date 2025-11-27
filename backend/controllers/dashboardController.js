import Item from '../models/Item.js';
import Swap from '../models/Swap.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const [activeListings, pendingSwaps, completedSwaps, totalPoints] = await Promise.all([
      Item.countDocuments({ userId, isAvailable: true }),
      Swap.countDocuments({
        $or: [{ requesterId: userId }, { ownerId: userId }],
        status: 'pending',
      }),
      Swap.countDocuments({
        $or: [{ requesterId: userId }, { ownerId: userId }],
        status: 'completed',
      }),
      User.findById(userId).select('points'),
    ]);

    res.json({
      activeListings,
      pendingSwaps,
      completedSwaps,
      points: totalPoints?.points || 0,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // Combine recent items and swaps
    // This is a simplified version
    const recentItems = await Item.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt pointsValue');

    res.json({
      recentItems,
    });
  } catch (err) {
    next(err);
  }
};
