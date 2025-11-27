import Joi from 'joi';

export const createItemSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  category: Joi.string()
    .required()
    .valid('Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other'),
  size: Joi.string().required(),
  condition: Joi.string().required().valid('Excellent', 'Good', 'Fair', 'Poor'),
  pointsValue: Joi.number().min(1).max(1000).optional(), // Can be auto-calculated
  images: Joi.array().items(Joi.string().uri()).optional(),
  location: Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().optional(),
  }).optional(),
  brand: Joi.string().optional().allow(''),
  color: Joi.string().optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const updateItemSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  category: Joi.string()
    .valid('Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other')
    .optional(),
  size: Joi.string().optional(),
  condition: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor').optional(),
  pointsValue: Joi.number().min(1).max(1000).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  location: Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().optional(),
  }).optional(),
  brand: Joi.string().optional().allow(''),
  color: Joi.string().optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
  isAvailable: Joi.boolean().optional(),
});

export const searchItemSchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
  search: Joi.string().optional().allow(''),
  category: Joi.string().optional().allow('all', ''),
  size: Joi.string().optional().allow('all', ''),
  condition: Joi.string().optional().allow('all', ''),
  minPoints: Joi.number().optional().allow(''),
  maxPoints: Joi.number().optional().allow(''),
  color: Joi.string().optional().allow(''),
  brand: Joi.string().optional().allow(''),
  location: Joi.string().optional().allow(''),
  sortBy: Joi.string()
    .valid(
      'newest',
      'oldest',
      'pointsLowToHigh',
      'pointsHighToLow',
      'mostViewed',
      'mostLiked',
      'alphabetical'
    )
    .optional(),
});
