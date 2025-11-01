const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getTransactionTrends,
  getRevenueByPlatform,
  getUserGrowth,
  getTopCards,
  getTopCardOwners,
  getTransactionStatusDistribution,
  getPopularProducts
} = require('../controllers/analyticsController');

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard overview
router.get('/dashboard-stats', getDashboardStats);

// Transaction analytics
router.get('/transaction-trends', getTransactionTrends);
router.get('/transaction-status', getTransactionStatusDistribution);

// Revenue analytics
router.get('/revenue-by-platform', getRevenueByPlatform);

// User analytics
router.get('/user-growth', getUserGrowth);
router.get('/top-card-owners', getTopCardOwners);

// Card analytics
router.get('/top-cards', getTopCards);

// Product analytics
router.get('/popular-products', getPopularProducts);

module.exports = router;
