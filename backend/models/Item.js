import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other']
  },
  size: { 
    type: String, 
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', '6', '7', '8', '9', '10', '11', '12', '13', '14']
  },
  condition: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  brand: { type: String, default: '' },
  color: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  pointsValue: { type: Number, required: true, min: 1, max: 100 },
  isAvailable: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }]
}, { timestamps: true });

// Index for better search performance
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1, size: 1 });
itemSchema.index({ userId: 1 });
itemSchema.index({ isAvailable: 1 });

export default mongoose.model('Item', itemSchema);
