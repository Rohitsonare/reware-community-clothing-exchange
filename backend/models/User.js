import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Not required for social login
  profilePicture: { type: String, default: '' },
  points: { type: Number, default: 0 },
  googleId: { type: String, default: '' },
  appleId: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'USA' }
  },
  preferences: {
    sizes: [{ type: String }],
    categories: [{ type: String }],
    brands: [{ type: String }]
  },
  stats: {
    totalSwaps: { type: Number, default: 0 },
    successfulSwaps: { type: Number, default: 0 },
    itemsListed: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    reviews: { type: Number, default: 0 }
  },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
