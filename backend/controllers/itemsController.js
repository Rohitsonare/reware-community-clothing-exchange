import Item from '../models/Item.js';
import logger from '../utils/logger.js';

export const getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const {
      search,
      category,
      size,
      condition,
      minPoints,
      maxPoints,
      color,
      brand,
      location,
      sortBy,
    } = req.query;

    let query = { isAvailable: true };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Filters
    if (category && category !== 'all') query.category = category;
    if (size && size !== 'all') query.size = size;
    if (condition && condition !== 'all') query.condition = condition;

    if (minPoints || maxPoints) {
      query.pointsValue = {};
      if (minPoints) query.pointsValue.$gte = parseInt(minPoints);
      if (maxPoints) query.pointsValue.$lte = parseInt(maxPoints);
    }

    if (color) query.color = { $regex: color, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: newest
    if (sortBy) {
      switch (sortBy) {
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'pointsLowToHigh':
          sort = { pointsValue: 1 };
          break;
        case 'pointsHighToLow':
          sort = { pointsValue: -1 };
          break;
        case 'mostViewed':
          sort = { views: -1 };
          break;
        case 'mostLiked':
          sort = { likesCount: -1 };
          break; // Assuming likesCount exists or needs aggregation
        case 'alphabetical':
          sort = { title: 1 };
          break;
      }
    }

    const items = await Item.find(query)
      .populate('userId', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name avatar email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req, res, next) => {
  try {
    // TODO: Get user ID from auth middleware (req.user)
    // For now, assuming userId is passed in body or we need to extract it
    // Ideally: const userId = req.user.id;

    // Temporary fallback if auth middleware isn't fully wired up to populate req.user yet
    // But we should enforce auth.

    const newItem = new Item({
      ...req.body,
      userId: req.user ? req.user.id : req.body.userId, // Fallback for now
      createdAt: new Date(),
      views: 0,
      likes: [],
    });

    const savedItem = await newItem.save();
    logger.info(`New item created: ${savedItem.title}`);
    res.status(201).json(savedItem);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (req.user && item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    Object.assign(item, req.body);
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    logger.info(`Item updated: ${updatedItem._id}`);
    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (req.user && item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    logger.info(`Item deleted: ${req.params.id}`);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const likeItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const userId = req.user ? req.user.id : req.body.userId; // Fallback
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const index = item.likes.indexOf(userId);
    let isLiked = false;

    if (index === -1) {
      item.likes.push(userId);
      isLiked = true;
    } else {
      item.likes.splice(index, 1);
      isLiked = false;
    }

    await item.save();
    res.json({
      isLiked,
      likesCount: item.likes.length,
      message: isLiked ? 'Item liked' : 'Item unliked',
    });
  } catch (err) {
    next(err);
  }
};

export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const suggestions = await Item.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    })
      .select('title brand category images')
      .limit(5);

    res.json(suggestions);
  } catch (err) {
    next(err);
  }
};
