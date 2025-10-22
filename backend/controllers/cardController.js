const Card = require('../models/Card');
const User = require('../models/User');

// @desc    Add a new card
// @route   POST /api/cards
// @access  Private (Card Owner)
const addCard = async (req, res) => {
  try {
    const { bankName, cardType, cardNetwork, lastFourDigits, availableDiscounts, usageLimit } = req.body;

    const card = await Card.create({
      owner: req.user._id,
      bankName,
      cardType,
      cardNetwork,
      lastFourDigits,
      availableDiscounts,
      usageLimit: usageLimit || 5
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all available cards with discounts
// @route   GET /api/cards
// @access  Public
const getCards = async (req, res) => {
  try {
    const { platform, bankName, minDiscount } = req.query;

    let query = { isAvailable: true };

    // Filter by platform
    if (platform) {
      query['availableDiscounts.platform'] = platform;
    }

    // Filter by bank name
    if (bankName) {
      query.bankName = new RegExp(bankName, 'i');
    }

    const cards = await Card.find(query)
      .populate('owner', 'name email phone rating')
      .sort({ rating: -1, totalTransactions: -1 });

    // Filter by minimum discount if specified
    let filteredCards = cards;
    if (minDiscount) {
      filteredCards = cards.filter(card =>
        card.availableDiscounts.some(d => d.discountPercentage >= parseFloat(minDiscount))
      );
    }

    res.json(filteredCards);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get card by ID
// @route   GET /api/cards/:id
// @access  Public
const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate('owner', 'name email phone rating');

    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get cards owned by logged-in user
// @route   GET /api/cards/myCards
// @access  Private (Card Owner)
const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ owner: req.user._id });
    res.json(cards);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update card
// @route   PUT /api/cards/:id
// @access  Private (Card Owner)
const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (card) {
      // Check if user owns the card
      if (card.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this card' });
      }

      card.bankName = req.body.bankName || card.bankName;
      card.cardType = req.body.cardType || card.cardType;
      card.availableDiscounts = req.body.availableDiscounts || card.availableDiscounts;
      card.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : card.isAvailable;
      card.usageLimit = req.body.usageLimit || card.usageLimit;

      const updatedCard = await card.save();
      res.json(updatedCard);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete card
// @route   DELETE /api/cards/:id
// @access  Private (Card Owner)
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (card) {
      // Check if user owns the card
      if (card.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this card' });
      }

      await card.deleteOne();
      res.json({ message: 'Card removed' });
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addCard, getCards, getCardById, getMyCards, updateCard, deleteCard };
