import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [0, 'Budget must be a positive number']
  },
  category: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data Science', 'Other'],
    default: 'Other'
  },
  skills: {
    type: [String],
    default: []
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed'],
    default: 'open'
  },
  hiredFreelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for searching
gigSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Gig', gigSchema);
