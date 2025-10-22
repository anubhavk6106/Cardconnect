const express = require('express');
const {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  respondToTransaction,
  completeTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getMyTransactions)
  .post(protect, createTransaction);

router.get('/:id', protect, getTransactionById);
router.put('/:id/respond', protect, respondToTransaction);
router.put('/:id/complete', protect, completeTransaction);

module.exports = router;
