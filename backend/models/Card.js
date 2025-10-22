const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  cardType: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  cardNetwork: {
    type: String,
    enum: ['Visa', 'Mastercard', 'RuPay', 'American Express'],
    required: true
  },
  lastFourDigits: {
    type: String,
    required: true,
    length: 4
  },
  cardImage: {
    type: String,
    default: null
  },
  availableDiscounts: [{
    platform: {
      type: String,
      enum: ['Amazon', 'Flipkart', 'Myntra', 'Other'],
      required: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    maxDiscount: {
      type: Number,
      required: true
    },
    minPurchase: {
      type: Number,
      default: 0
    },
    validUntil: {
      type: Date,
      required: true
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: 5 // Max transactions per month
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
