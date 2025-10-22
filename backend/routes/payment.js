const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
  handleWebhook,
} = require('../controllers/paymentController');

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, createOrder);

// @route   POST /api/payment/verify
// @desc    Verify payment signature
// @access  Private
router.post('/verify', protect, verifyPayment);

// @route   GET /api/payment/:paymentId
// @desc    Get payment details
// @access  Private
router.get('/:paymentId', protect, getPaymentDetails);

// @route   POST /api/payment/refund
// @desc    Refund payment (Admin only)
// @access  Private/Admin
router.post('/refund', protect, refundPayment);

// @route   POST /api/payment/webhook
// @desc    Handle Razorpay webhooks
// @access  Public (verified by signature)
router.post('/webhook', handleWebhook);

module.exports = router;
