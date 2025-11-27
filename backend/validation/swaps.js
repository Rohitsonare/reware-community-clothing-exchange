import Joi from 'joi';

export const createSwapRequestSchema = Joi.object({
  itemId: Joi.string().required(),
  requesterId: Joi.string().required(),
  requesterItemId: Joi.string().required(),
  message: Joi.string().optional().allow(''),
});

export const updateSwapStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'rejected', 'completed', 'cancelled')
    .required(),
});
