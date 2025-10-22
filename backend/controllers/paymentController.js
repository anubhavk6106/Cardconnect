const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Card = require('../models/Card');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    const { amount, transactionId } = req.body;

    // Verify transaction exists and belongs to user
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `rcpt_${transactionId}`,
      notes: {
        transactionId: transactionId,
        buyerId: req.user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    // Update transaction with order ID
    transaction.paymentOrderId = order.id;
    await transaction.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId,
    } = req.body;

    // Generate signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(body.toString())
      .digest('hex');

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update transaction status
    const transaction = await Transaction.findById(transactionId)
      .populate('buyer', 'name email')
      .populate('cardOwner', 'name email')
      .populate('card', 'bankName cardType');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = 'completed';
    transaction.paymentId = razorpay_payment_id;
    transaction.paymentStatus = 'paid';
    await transaction.save();

    // Update buyer and card owner stats
    await User.findByIdAndUpdate(transaction.buyer._id, {
      $inc: { 'stats.totalTransactions': 1, 'stats.totalSavings': transaction.discountAmount },
    });

    await User.findByIdAndUpdate(transaction.cardOwner._id, {
      $inc: {
        'stats.totalTransactions': 1,
        'stats.totalEarnings': transaction.commissionAmount,
      },
    });

    // Update card usage
    await Card.findByIdAndUpdate(transaction.card._id, {
      $inc: { usageCount: 1 },
      lastUsed: new Date(),
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json(payment);
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, transactionId } = req.body;

    // Verify admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Create refund
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if amount not specified
      notes: {
        transactionId: transactionId,
      },
    });

    // Update transaction
    const transaction = await Transaction.findById(transactionId);
    if (transaction) {
      transaction.status = 'refunded';
      transaction.paymentStatus = 'refunded';
      transaction.refundId = refund.id;
      await transaction.save();
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund,
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Webhook handler
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('Webhook secret not configured');
      return res.status(200).json({ received: true });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', payload.payment.entity.id);
        break;

      case 'payment.failed':
        console.log('Payment failed:', payload.payment.entity.id);
        // Update transaction status
        const failedTransaction = await Transaction.findOne({
          paymentOrderId: payload.payment.entity.order_id,
        });
        if (failedTransaction) {
          failedTransaction.status = 'failed';
          failedTransaction.paymentStatus = 'failed';
          await failedTransaction.save();
        }
        break;

      case 'refund.created':
        console.log('Refund created:', payload.refund.entity.id);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};
