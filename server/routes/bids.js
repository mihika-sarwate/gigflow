import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bids
// @desc    Submit a bid for a gig
// @access  Private
router.post('/', [
  protect,
  body('gigId').notEmpty().withMessage('Gig ID is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('price').isNumeric().withMessage('Price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gigId, message, price } = req.body;

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting bids' });
    }

    // Check if user is trying to bid on their own gig
    if (gig.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if user has already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this gig' });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget');

    res.status(201).json({ success: true, bid: populatedBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bids/:gigId
// @desc    Get all bids for a specific gig (Owner only)
// @access  Private
router.get('/:gigId', protect, async (req, res) => {
  try {
    // Check if gig exists
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bids.length, bids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bids/my-bids/list
// @desc    Get all bids submitted by the logged-in user
// @access  Private
router.get('/my-bids/list', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate('gigId', 'title description budget status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bids.length, bids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/bids/:bidId/hire
// @desc    Hire a freelancer (with MongoDB transaction for race condition prevention)
// @access  Private (Gig owner only)
router.patch('/:bidId/hire', protect, async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    // Start transaction
    session.startTransaction();

    // Find the bid with session
    const bid = await Bid.findById(req.params.bidId)
      .populate('gigId')
      .populate('freelancerId', 'name email')
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Get the gig
    const gig = await Gig.findById(bid.gigId._id).session(session);

    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'This gig has already been assigned' });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'This bid has already been processed' });
    }

    // ATOMIC OPERATIONS START HERE
    
    // 1. Update the gig status to 'assigned' and set hired freelancer
    await Gig.findByIdAndUpdate(
      gig._id,
      { status: 'assigned', hiredFreelancerId: bid.freelancerId._id },
      { session }
    );

    // 2. Update the selected bid to 'hired'
    await Bid.findByIdAndUpdate(
      bid._id,
      { status: 'hired' },
      { session }
    );

    // 3. Update all other bids for this gig to 'rejected'
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    // Get updated bid for response
    const updatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget status');

    // Send real-time notification via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(bid.freelancerId._id.toString()).emit('hired', {
        gigTitle: gig.title,
        gigId: gig._id,
        bidId: bid._id,
        message: `Congratulations! You have been hired for "${gig.title}"!`
      });
    }

    res.json({
      success: true,
      message: 'Freelancer hired successfully',
      bid: updatedBid
    });

  } catch (error) {
    // If error, abort transaction
    await session.abortTransaction();
    console.error('Hire transaction error:', error);
    res.status(500).json({ message: 'Server error during hiring process' });
  } finally {
    // End session
    session.endSession();
  }
});

export default router;
