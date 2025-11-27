import Swap from '../models/Swap.js';
import Item from '../models/Item.js';
import logger from '../utils/logger.js';

export const createSwapRequest = async (req, res, next) => {
  try {
    const { itemId, requesterId, requesterItemId, message } = req.body;

    // Verify items exist
    const targetItem = await Item.findById(itemId);
    const offeredItem = await Item.findById(requesterItemId);

    if (!targetItem || !offeredItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if swap already exists
    const existingSwap = await Swap.findOne({
      requesterId,
      itemId,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'Active swap request already exists' });
    }

    const swap = new Swap({
      itemId,
      ownerId: targetItem.userId,
      requesterId,
      requesterItemId,
      message,
      status: 'pending',
    });

    await swap.save();
    logger.info(`New swap request created: ${swap._id}`);

    res.status(201).json(swap);
  } catch (err) {
    next(err);
  }
};

export const getUserSwaps = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId; // Fallback
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const swaps = await Swap.find({
      $or: [{ requesterId: userId }, { ownerId: userId }],
    })
      .populate('itemId')
      .populate('requesterItemId')
      .populate('ownerId', 'name email')
      .populate('requesterId', 'name email')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    next(err);
  }
};

export const updateSwapStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // TODO: Add authorization check (only owner can accept/reject, requester can cancel)

    swap.status = status;
    await swap.save();

    // If accepted, update item availability
    if (status === 'accepted') {
      await Item.findByIdAndUpdate(swap.itemId, { isAvailable: false });
      await Item.findByIdAndUpdate(swap.requesterItemId, { isAvailable: false });
    }

    logger.info(`Swap ${swap._id} status updated to ${status}`);
    res.json(swap);
  } catch (err) {
    next(err);
  }
};
