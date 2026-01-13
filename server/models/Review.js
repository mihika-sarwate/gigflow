import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['client-to-freelancer', 'freelancer-to-client'],
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews
reviewSchema.index({ gigId: 1, reviewerId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
