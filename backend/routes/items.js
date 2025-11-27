import express from 'express';
import * as itemsController from '../controllers/itemsController.js';
import validate from '../middleware/validate.js';
import { createItemSchema, updateItemSchema, searchItemSchema } from '../validation/items.js';
// TODO: Import auth middleware when available/refactored
// import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', validate(searchItemSchema), itemsController.getItems); // Search schema validates query params
router.get('/search/suggestions', itemsController.getSearchSuggestions);
router.get('/:id', itemsController.getItemById);

// Protected routes (Add auth middleware later)
router.post('/', validate(createItemSchema), itemsController.createItem);
router.put('/:id', validate(updateItemSchema), itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);
router.post('/:id/like', itemsController.likeItem);

export default router;
