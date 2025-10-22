const Card = require('../models/Card');
const Transaction = require('../models/Transaction');

// @desc    Advanced card search
// @route   GET /api/search/cards
// @access  Public
const searchCards = async (req, res) => {
  try {
    const {
      platform,
      bankName,
      cardType,
      cardNetwork,
      minDiscount,
      maxDiscount,
      minRating,
      sortBy,
      order,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isAvailable: true };

    // Filter by platform
    if (platform) {
      query['availableDiscounts.platform'] = platform;
    }

    // Filter by bank name (case-insensitive)
    if (bankName) {
      query.bankName = new RegExp(bankName, 'i');
    }

    // Filter by card type
    if (cardType) {
      query.cardType = cardType;
    }

    // Filter by card network
    if (cardNetwork) {
      query.cardNetwork = cardNetwork;
    }

    // Filter by rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Fetch cards
    let cardsQuery = Card.find(query)
      .populate('owner', 'name email phone rating');

    // Sorting
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      
      switch (sortBy) {
        case 'rating':
          sortOptions.rating = sortOrder;
          break;
        case 'transactions':
          sortOptions.totalTransactions = sortOrder;
          break;
        case 'newest':
          sortOptions.createdAt = sortOrder;
          break;
        default:
          sortOptions.rating = -1; // Default: highest rating first
      }
    } else {
      sortOptions = { rating: -1, totalTransactions: -1 }; // Default sorting
    }

    cardsQuery = cardsQuery.sort(sortOptions);

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    cardsQuery = cardsQuery.skip(skip).limit(parseInt(limit));

    const cards = await cardsQuery;

    // Filter by discount amount if specified
    let filteredCards = cards;
    if (minDiscount || maxDiscount) {
      filteredCards = cards.filter(card => {
        return card.availableDiscounts.some(discount => {
          const meetsMin = minDiscount ? discount.discountPercentage >= parseFloat(minDiscount) : true;
          const meetsMax = maxDiscount ? discount.discountPercentage <= parseFloat(maxDiscount) : true;
          return meetsMin && meetsMax;
        });
      });
    }

    // Get total count for pagination
    const totalCards = await Card.countDocuments(query);
    const totalPages = Math.ceil(totalCards / parseInt(limit));

    res.json({
      cards: filteredCards,
      currentPage: parseInt(page),
      totalPages,
      totalCards,
      hasMore: parseInt(page) < totalPages
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get filter options
// @route   GET /api/search/filters
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    const banks = await Card.distinct('bankName');
    const networks = await Card.distinct('cardNetwork');
    const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Other'];

    res.json({
      banks: banks.sort(),
      networks: networks.sort(),
      platforms,
      cardTypes: ['credit', 'debit']
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search transactions
// @route   GET /api/search/transactions
// @access  Private
const searchTransactions = async (req, res) => {
  try {
    const { status, platform, dateFrom, dateTo, minAmount, maxAmount } = req.query;

    let query = {};

    // Filter by user role
    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'card_owner') {
      query.cardOwner = req.user._id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by platform
    if (platform) {
      query['product.platform'] = platform;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Filter by amount
    if (minAmount || maxAmount) {
      query['product.originalPrice'] = {};
      if (minAmount) query['product.originalPrice'].$gte = parseFloat(minAmount);
      if (maxAmount) query['product.originalPrice'].$lte = parseFloat(maxAmount);
    }

    const transactions = await Transaction.find(query)
      .populate('buyer', 'name email')
      .populate('cardOwner', 'name email')
      .populate('card')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  searchCards,
  getFilterOptions,
  searchTransactions
};
