const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import our gatekeeper
const Request = require('../models/Request'); // Import the Request model

// @route   POST /api/requests
// @desc    Create a new request
// @access  Private (only logged-in users)
router.post('/', protect, async (req, res) => {
  const { platform, offerDetails, amount } = req.body;

  try {
    const newRequest = new Request({
      platform,
      offerDetails,
      amount,
      user: req.user.id, // Attach the logged-in user's ID
    });

    const request = await newRequest.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/requests
// @desc    Get all open requests
// @access  Public (for now, so anyone can see them)
router.get('/', async (req, res) => {
  try {
    // Find all requests with status 'Open' and sort by newest first
    const requests = await Request.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;