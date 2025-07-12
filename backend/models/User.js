import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Not required for social login
  profilePicture: { type: String, default: '' },
  points: { type: Number, default: 0 },
  googleId: { type: String, default: '' },
  appleId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
