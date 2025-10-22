const express = require('express');
const { matchBuyerWithCard, recommendProducts } = require('../services/aiService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/ai/match-cards
// @desc    Get AI-matched cards for buyer preferences
// @access  Private
router.post('/match-cards', protect, async (req, res) => {
  try {
    const { platform, productPrice, preferredBank, location } = req.body;

    const matches = await matchBuyerWithCard({
      platform,
      productPrice,
      preferredBank,
      location
    });

    res.json(matches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/ai/recommendations
// @desc    Get AI-powered product recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const recommendations = await recommendProducts(req.user._id, req.user.role);
    res.json(recommendations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
