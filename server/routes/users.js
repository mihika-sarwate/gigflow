import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get reviews
    const reviews = await Review.find({ revieweeId: req.params.id })
      .populate('reviewerId', 'name')
      .populate('gigId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  protect,
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio too long'),
  body('hourlyRate').optional().isNumeric().withMessage('Hourly rate must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bio, skills, location, hourlyRate } = req.body;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (location !== undefined) updateData.location = location;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/review
// @desc    Submit a review
// @access  Private
router.post('/review', [
  protect,
  body('gigId').notEmpty().withMessage('Gig ID is required'),
  body('revieweeId').notEmpty().withMessage('Reviewee ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('type').isIn(['client-to-freelancer', 'freelancer-to-client']).withMessage('Invalid review type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gigId, revieweeId, rating, comment, type } = req.body;

    // Check if review already exists
    const existingReview = await Review.findOne({
      gigId,
      reviewerId: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this project' });
    }

    // Create review
    const review = await Review.create({
      gigId,
      reviewerId: req.user.id,
      revieweeId,
      rating,
      comment,
      type
    });

    // Update user's average rating
    const allReviews = await Review.find({ revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(revieweeId, {
      rating: avgRating,
      reviewCount: allReviews.length
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewerId', 'name')
      .populate('gigId', 'title');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const Gig = (await import('../models/Gig.js')).default;
    const Bid = (await import('../models/Bid.js')).default;

    const [
      gigsPosted,
      gigsCompleted,
      bidsSubmitted,
      bidsWon,
      totalEarnings,
      totalSpent
    ] = await Promise.all([
      Gig.countDocuments({ ownerId: req.user.id }),
      Gig.countDocuments({ ownerId: req.user.id, status: 'completed' }),
      Bid.countDocuments({ freelancerId: req.user.id }),
      Bid.countDocuments({ freelancerId: req.user.id, status: 'hired' }),
      Bid.aggregate([
        { $match: { freelancerId: req.user._id, status: 'hired' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),
      Bid.aggregate([
        { $match: { status: 'hired' } },
        { $lookup: { from: 'gigs', localField: 'gigId', foreignField: '_id', as: 'gig' } },
        { $unwind: '$gig' },
        { $match: { 'gig.ownerId': req.user._id } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        gigsPosted,
        gigsCompleted,
        bidsSubmitted,
        bidsWon,
        totalEarnings: totalEarnings[0]?.total || 0,
        totalSpent: totalSpent[0]?.total || 0,
        successRate: bidsSubmitted > 0 ? ((bidsWon / bidsSubmitted) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
