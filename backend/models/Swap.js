import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  ownerItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: { type: String, default: '' },
  ownerResponse: { type: String, default: '' },
  meetingDetails: {
    location: { type: String, default: '' },
    date: { type: Date },
    notes: { type: String, default: '' }
  },
  pointsExchanged: { type: Number, default: 0 },
  rating: {
    requesterRating: { type: Number, min: 1, max: 5 },
    ownerRating: { type: Number, min: 1, max: 5 },
    requesterReview: { type: String, default: '' },
    ownerReview: { type: String, default: '' }
  },
  completedAt: { type: Date },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days from creation
}, { timestamps: true });

// Indexes for better query performance
swapSchema.index({ requesterId: 1, status: 1 });
swapSchema.index({ ownerId: 1, status: 1 });
swapSchema.index({ status: 1 });
swapSchema.index({ expiresAt: 1 });

export default mongoose.model('Swap', swapSchema);
