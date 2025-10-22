const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  product: {
    name: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      enum: ['Amazon', 'Flipkart', 'Myntra', 'Other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    originalPrice: {
      type: Number,
      required: true
    },
    discountedPrice: {
      type: Number,
      required: true
    }
  },
  discountAmount: {
    type: Number,
    required: true
  },
  serviceFee: {
    type: Number,
    required: true,
    default: function() {
      return this.discountAmount * 0.15; // 15% service fee
    }
  },
  ownerEarnings: {
    type: Number,
    required: true,
    default: function() {
      return this.discountAmount * 0.85; // 85% to card owner
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentOrderId: String,
  paymentId: String,
  refundId: String,
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  completedAt: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
