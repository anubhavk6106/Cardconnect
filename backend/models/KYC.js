const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  documents: {
    idProof: {
      type: {
        type: String,
        enum: ['aadhaar', 'pan', 'passport', 'driving_license', 'voter_id'],
        required: true
      },
      number: {
        type: String,
        required: true
      },
      frontImage: {
        type: String,
        required: true
      },
      backImage: String
    },
    addressProof: {
      type: {
        type: String,
        enum: ['utility_bill', 'bank_statement', 'rental_agreement', 'aadhaar'],
        required: true
      },
      image: {
        type: String,
        required: true
      }
    },
    selfie: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  verificationLevel: {
    type: String,
    enum: ['none', 'basic', 'verified', 'premium'],
    default: 'none'
  },
  notes: String
}, {
  timestamps: true
});

// Index for faster queries
kycSchema.index({ user: 1 });
kycSchema.index({ status: 1, submittedAt: -1 });

module.exports = mongoose.model('KYC', kycSchema);
