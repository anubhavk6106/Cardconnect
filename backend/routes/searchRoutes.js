const express = require('express');
const {
  searchCards,
  getFilterOptions,
  searchTransactions
} = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/cards', searchCards);
router.get('/filters', getFilterOptions);
router.get('/transactions', protect, searchTransactions);

module.exports = router;
