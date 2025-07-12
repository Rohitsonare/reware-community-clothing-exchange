import express from 'express';
import Swap from '../models/Swap.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

const router = express.Router();

// Get all swaps for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const swaps = await Swap.find({
      $or: [
        { requesterId: userId },
        { ownerId: userId }
      ]
    })
    .populate('ownerItemId')
    .populate('requesterItemId')
    .populate('requesterId', 'name email avatar')
    .populate('ownerId', 'name email avatar')
    .sort({ createdAt: -1 });

    res.json({ swaps });
  } catch (error) {
    console.error('Error fetching swaps:', error);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// Create a new swap request
router.post('/request', async (req, res) => {
  try {
    const { itemId, requesterId, requesterItemId, message } = req.body;

    if (!itemId || !requesterId) {
      return res.status(400).json({ error: 'Item ID and requester ID are required' });
    }

    // Get the item to find the owner
    const item = await Item.findById(itemId).populate('userId');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if the requester is not the owner
    if (item.userId._id.toString() === requesterId) {
      return res.status(400).json({ error: 'You cannot request to swap your own item' });
    }

    // For now, we'll use a placeholder requester item ID or the same item ID
    // In a real implementation, you'd let the user select which item they want to offer
    const requesterItem = requesterItemId || itemId; // Temporary solution

    // Check if there's already a pending swap request for this item from this user
    const existingSwap = await Swap.findOne({
      ownerItemId: itemId,
      requesterId,
      status: 'pending'
    });

    if (existingSwap) {
      return res.status(400).json({ error: 'You already have a pending swap request for this item' });
    }

    // Create the swap request
    const swap = new Swap({
      ownerItemId: itemId,
      requesterItemId: requesterItem,
      requesterId,
      ownerId: item.userId._id,
      message: message || `Swap request for ${item.title}`,
      status: 'pending'
    });

    await swap.save();

    // Populate the swap with related data
    const populatedSwap = await Swap.findById(swap._id)
      .populate('ownerItemId')
      .populate('requesterItemId')
      .populate('requesterId', 'name email avatar')
      .populate('ownerId', 'name email avatar');

    res.status(201).json({ 
      swap: populatedSwap,
      message: 'Swap request sent successfully!'
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({ error: 'Failed to create swap request' });
  }
});

// Update swap status (accept, reject, complete)
router.patch('/:swapId/status', async (req, res) => {
  try {
    const { swapId } = req.params;
    const { status, userId } = req.body;

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Only the owner can accept/reject, both parties can mark as complete
    if (status === 'accepted' || status === 'rejected') {
      if (swap.ownerId.toString() !== userId) {
        return res.status(403).json({ error: 'Only the item owner can accept or reject swap requests' });
      }
    }

    swap.status = status;
    swap.updatedAt = new Date();
    await swap.save();

    // If accepted, mark the item as no longer available
    if (status === 'accepted') {
      await Item.findByIdAndUpdate(swap.itemId, { isAvailable: false });
    }

    // If rejected, mark the item as available again
    if (status === 'rejected') {
      await Item.findByIdAndUpdate(swap.itemId, { isAvailable: true });
    }

    const populatedSwap = await Swap.findById(swap._id)
      .populate('itemId')
      .populate('requesterId', 'name email avatar')
      .populate('ownerId', 'name email avatar');

    res.json({ 
      swap: populatedSwap,
      message: `Swap request ${status} successfully!`
    });
  } catch (error) {
    console.error('Error updating swap status:', error);
    res.status(500).json({ error: 'Failed to update swap status' });
  }
});

// Get swap details
router.get('/:swapId', async (req, res) => {
  try {
    const { swapId } = req.params;

    const swap = await Swap.findById(swapId)
      .populate('itemId')
      .populate('requesterId', 'name email avatar')
      .populate('ownerId', 'name email avatar');

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    res.json({ swap });
  } catch (error) {
    console.error('Error fetching swap details:', error);
    res.status(500).json({ error: 'Failed to fetch swap details' });
  }
});

export default router;
