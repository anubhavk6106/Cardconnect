const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/multer');
const {
  submitKYC,
  getMyKYC,
  getAllKYCSubmissions,
  getKYCById,
  reviewKYC,
  markUnderReview,
  deleteKYC,
  getKYCStats
} = require('../controllers/kycController');

// User routes (require authentication)
router.use(protect);

// Submit KYC with document uploads
router.post('/submit', upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), submitKYC);

// Get current user's KYC status
router.get('/my-kyc', getMyKYC);

// Admin routes
router.get('/all', admin, getAllKYCSubmissions);
router.get('/stats', admin, getKYCStats);
router.get('/:id', admin, getKYCById);
router.put('/:id/review', admin, reviewKYC);
router.put('/:id/under-review', admin, markUnderReview);
router.delete('/:id', admin, deleteKYC);

module.exports = router;
