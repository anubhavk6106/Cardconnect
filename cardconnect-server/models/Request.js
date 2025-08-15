const mongoose = require('mongoose');

// This is the blueprint for our offer requests
const requestSchema = new mongoose.Schema({
  // Link to the user who created the request
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This connects it to our User model
    required: true,
  },
  platform: {
    type: String, // e.g., "Amazon", "Flipkart"
    required: true,
  },
  offerDetails: {
    type: String, // e.g., "10% off with HDFC Credit Card"
    required: true,
  },
  amount: {
    type: Number, // The purchase amount
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Matched', 'Completed', 'Cancelled'], // The request can only have one of these statuses
    default: 'Open',
  },
  cardholder: { // The user who accepts the request
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;