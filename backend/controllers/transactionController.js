const Transaction = require('../models/Transaction');
const Card = require('../models/Card');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { sendNotificationToUser } = require('../services/socketService');
const { createNotification } = require('./notificationController');

// @desc    Create a transaction request
// @route   POST /api/transactions
// @access  Private (Buyer)
const createTransaction = async (req, res) => {
  try {
    const { cardId, product } = req.body;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (!card.isAvailable) {
      return res.status(400).json({ message: 'Card is not available' });
    }

    if (card.currentUsage >= card.usageLimit) {
      return res.status(400).json({ message: 'Card usage limit reached' });
    }

    // Find applicable discount
    const discount = card.availableDiscounts.find(
      d => d.platform === product.platform && new Date(d.validUntil) > new Date()
    );

    if (!discount) {
      return res.status(400).json({ message: 'No valid discount found for this platform' });
    }

    // Calculate discount amount
    let discountAmount = (product.originalPrice * discount.discountPercentage) / 100;
    if (discountAmount > discount.maxDiscount) {
      discountAmount = discount.maxDiscount;
    }

    const discountedPrice = product.originalPrice - discountAmount;

    const transaction = await Transaction.create({
      buyer: req.user._id,
      cardOwner: card.owner,
      card: cardId,
      product: {
        ...product,
        discountedPrice
      },
      discountAmount,
      serviceFee: discountAmount * 0.15,
      ownerEarnings: discountAmount * 0.85
    });

    // Populate transaction details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('buyer', 'name email phone')
      .populate('cardOwner', 'name email phone')
      .populate('card');

    // Send notification to card owner
    await createNotification(
      card.owner,
      'transaction_request',
      'New Transaction Request',
      `${req.user.name} wants to use your ${card.bankName} card for ${product.name}`,
      '/card-owner/dashboard',
      transaction._id
    );

    // Send real-time notification
    sendNotificationToUser(card.owner, 'new_transaction_request', {
      transactionId: transaction._id,
      buyerName: req.user.name,
      productName: product.name
    });

    // Send email notification
    const cardOwner = await User.findById(card.owner);
    if (cardOwner && cardOwner.email) {
      sendEmail(cardOwner.email, 'transactionRequest', [req.user.name, product.name, cardOwner.name]);
    }

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'buyer') {
      query = { buyer: req.user._id };
    } else if (req.user.role === 'card_owner') {
      query = { cardOwner: req.user._id };
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const transactions = await Transaction.find(query)
      .populate('buyer', 'name email phone')
      .populate('cardOwner', 'name email phone')
      .populate('card')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('cardOwner', 'name email phone')
      .populate('card');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check authorization
    if (
      transaction.buyer.toString() !== req.user._id.toString() &&
      transaction.cardOwner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Approve/Reject transaction (Card Owner)
// @route   PUT /api/transactions/:id/respond
// @access  Private (Card Owner)
const respondToTransaction = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is the card owner
    if (transaction.cardOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    transaction.status = status;

    if (status === 'approved') {
      transaction.approvedAt = Date.now();

      // Update card usage
      const card = await Card.findById(transaction.card);
      card.currentUsage += 1;
      await card.save();
    }

    await transaction.save();

    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('buyer', 'name email phone')
      .populate('cardOwner', 'name email phone')
      .populate('card');

    // Send notification to buyer
    const notifType = status === 'approved' ? 'transaction_approved' : 'transaction_rejected';
    const notifTitle = status === 'approved' ? 'Transaction Approved!' : 'Transaction Not Approved';
    const notifMessage = status === 'approved' 
      ? `Your request for ${transaction.product.name} has been approved!`
      : `Your request for ${transaction.product.name} was not approved.`;

    await createNotification(
      transaction.buyer,
      notifType,
      notifTitle,
      notifMessage,
      '/transactions',
      transaction._id
    );

    // Send real-time notification
    sendNotificationToUser(transaction.buyer, status === 'approved' ? 'transaction_approved' : 'transaction_rejected', {
      transactionId: transaction._id,
      productName: transaction.product.name
    });

    // Send email notification
    const buyer = await User.findById(transaction.buyer);
    if (buyer && buyer.email) {
      if (status === 'approved') {
        sendEmail(buyer.email, 'transactionApproved', [buyer.name, transaction.product.name, transaction.discountAmount]);
      } else {
        sendEmail(buyer.email, 'transactionRejected', [buyer.name, transaction.product.name]);
      }
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Complete transaction
// @route   PUT /api/transactions/:id/complete
// @access  Private (Buyer)
const completeTransaction = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is the buyer
    if (transaction.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (transaction.status !== 'approved') {
      return res.status(400).json({ message: 'Transaction must be approved first' });
    }

    transaction.status = 'completed';
    transaction.completedAt = Date.now();
    transaction.paymentStatus = 'paid';
    transaction.rating = rating;
    transaction.review = review;

    await transaction.save();

    // Update card statistics
    const card = await Card.findById(transaction.card);
    card.totalTransactions += 1;
    const avgRating = (card.rating * (card.totalTransactions - 1) + rating) / card.totalTransactions;
    card.rating = Math.round(avgRating * 10) / 10;
    await card.save();

    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('buyer', 'name email phone')
      .populate('cardOwner', 'name email phone')
      .populate('card');

    // Send notification to card owner
    await createNotification(
      transaction.cardOwner,
      'transaction_completed',
      'Transaction Completed!',
      `${transaction.buyer.name} completed the purchase. You earned ₹${transaction.ownerEarnings.toFixed(2)}`,
      '/card-owner/dashboard',
      transaction._id
    );

    // Send real-time notification
    sendNotificationToUser(transaction.cardOwner, 'transaction_completed', {
      transactionId: transaction._id,
      buyerName: transaction.buyer.name,
      earnings: transaction.ownerEarnings
    });

    // Send email notification
    const cardOwner = await User.findById(transaction.cardOwner);
    if (cardOwner && cardOwner.email) {
      sendEmail(cardOwner.email, 'transactionCompleted', [cardOwner.name, transaction.buyer.name, transaction.ownerEarnings.toFixed(2)]);
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  respondToTransaction,
  completeTransaction
};
