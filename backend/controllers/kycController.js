const KYC = require('../models/KYC');
const User = require('../models/User');

// Submit KYC for verification
exports.submitKYC = async (req, res) => {
  try {
    const { idProofType, idProofNumber, addressProofType } = req.body;
    const { idFront, idBack, addressProof, selfie } = req.files || {};

    // Validate required files
    if (!idFront || !addressProof || !selfie) {
      return res.status(400).json({
        success: false,
        message: 'All document images are required (ID front, address proof, selfie)'
      });
    }

    // Check if KYC already exists
    const existingKYC = await KYC.findOne({ user: req.user._id });
    
    if (existingKYC && existingKYC.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'KYC already verified for this user'
      });
    }

    // Prepare KYC data
    const kycData = {
      user: req.user._id,
      documents: {
        idProof: {
          type: idProofType,
          number: idProofNumber,
          frontImage: idFront[0].path,
          backImage: idBack ? idBack[0].path : null
        },
        addressProof: {
          type: addressProofType,
          image: addressProof[0].path
        },
        selfie: selfie[0].path
      },
      status: 'pending',
      submittedAt: new Date()
    };

    let kyc;
    if (existingKYC) {
      // Update existing KYC
      Object.assign(existingKYC, kycData);
      kyc = await existingKYC.save();
    } else {
      // Create new KYC
      kyc = await KYC.create(kycData);
    }

    // Update user verification status
    await User.findByIdAndUpdate(req.user._id, {
      'verification.status': 'pending',
      'verification.kycId': kyc._id
    });

    res.status(201).json({
      success: true,
      message: 'KYC submitted successfully. It will be reviewed soon.',
      data: kyc
    });
  } catch (error) {
    console.error('Error submitting KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting KYC',
      error: error.message
    });
  }
};

// Get user's KYC status
exports.getMyKYC = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user._id })
      .populate('reviewedBy', 'name email');

    if (!kyc) {
      return res.json({
        success: true,
        data: null,
        message: 'No KYC submission found'
      });
    }

    res.json({
      success: true,
      data: kyc
    });
  } catch (error) {
    console.error('Error fetching KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC',
      error: error.message
    });
  }
};

// Get all KYC submissions (Admin only)
exports.getAllKYCSubmissions = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const kycSubmissions = await KYC.find(filter)
      .populate('user', 'name email phone role')
      .populate('reviewedBy', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: kycSubmissions
    });
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC submissions',
      error: error.message
    });
  }
};

// Get single KYC by ID (Admin only)
exports.getKYCById = async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.id)
      .populate('user', 'name email phone role address')
      .populate('reviewedBy', 'name email');

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC submission not found'
      });
    }

    res.json({
      success: true,
      data: kyc
    });
  } catch (error) {
    console.error('Error fetching KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC',
      error: error.message
    });
  }
};

// Review KYC submission (Admin only)
exports.reviewKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, verificationLevel, notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting KYC'
      });
    }

    const kyc = await KYC.findById(id);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC submission not found'
      });
    }

    // Update KYC
    kyc.status = status;
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = req.user._id;
    kyc.notes = notes || '';

    if (status === 'approved') {
      kyc.verificationLevel = verificationLevel || 'verified';
    } else {
      kyc.rejectionReason = rejectionReason;
      kyc.verificationLevel = 'none';
    }

    await kyc.save();

    // Update user verification status
    const userUpdate = {
      'verification.status': status,
      'verification.isVerified': status === 'approved',
      'verification.level': kyc.verificationLevel
    };

    await User.findByIdAndUpdate(kyc.user, userUpdate);

    res.json({
      success: true,
      message: `KYC ${status} successfully`,
      data: kyc
    });
  } catch (error) {
    console.error('Error reviewing KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing KYC',
      error: error.message
    });
  }
};

// Mark KYC as under review (Admin only)
exports.markUnderReview = async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await KYC.findByIdAndUpdate(
      id,
      { status: 'under_review' },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC submission not found'
      });
    }

    await User.findByIdAndUpdate(kyc.user, {
      'verification.status': 'under_review'
    });

    res.json({
      success: true,
      message: 'KYC marked as under review',
      data: kyc
    });
  } catch (error) {
    console.error('Error updating KYC status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating KYC status',
      error: error.message
    });
  }
};

// Delete KYC submission (Admin only)
exports.deleteKYC = async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await KYC.findById(id);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC submission not found'
      });
    }

    await User.findByIdAndUpdate(kyc.user, {
      'verification.status': 'none',
      'verification.isVerified': false,
      'verification.level': 'none',
      'verification.kycId': null
    });

    await kyc.deleteOne();

    res.json({
      success: true,
      message: 'KYC submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting KYC',
      error: error.message
    });
  }
};

// Get KYC statistics (Admin only)
exports.getKYCStats = async (req, res) => {
  try {
    const total = await KYC.countDocuments();
    const pending = await KYC.countDocuments({ status: 'pending' });
    const underReview = await KYC.countDocuments({ status: 'under_review' });
    const approved = await KYC.countDocuments({ status: 'approved' });
    const rejected = await KYC.countDocuments({ status: 'rejected' });

    const verifiedUsers = await User.countDocuments({ 'verification.isVerified': true });

    res.json({
      success: true,
      data: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        verifiedUsers
      }
    });
  } catch (error) {
    console.error('Error fetching KYC stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC statistics',
      error: error.message
    });
  }
};
