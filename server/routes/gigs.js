import express from 'express';
import { body, validationResult } from 'express-validator';
import Gig from '../models/Gig.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/gigs
// @desc    Get all open gigs with optional search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: gigs.length, gigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gigs/my-gigs
// @desc    Get all gigs posted by the logged-in user
// @access  Private
router.get('/my-gigs', protect, async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user.id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: gigs.length, gigs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gigs/:id
// @desc    Get single gig by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json({ success: true, gig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gigs
// @desc    Create a new gig
// @access  Private
router.post('/', [
  protect,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id
    });

    const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

    res.status(201).json({ success: true, gig: populatedGig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/gigs/:id
// @desc    Update a gig
// @access  Private (Owner only)
router.put('/:id', [
  protect,
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('budget').optional().isNumeric().withMessage('Budget must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is owner
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this gig' });
    }

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    res.json({ success: true, gig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/gigs/:id
// @desc    Delete a gig
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is owner
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }

    await gig.deleteOne();

    res.json({ success: true, message: 'Gig removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
