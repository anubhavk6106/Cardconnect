const express = require('express');
const upload = require('../config/multer');
const { uploadToCloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const fs = require('fs');

const router = express.Router();

// @desc    Upload profile picture
// @route   POST /api/upload/profile
// @access  Private
router.post('/profile', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary if configured, otherwise use local
    let imageUrl = `/uploads/${req.file.filename}`;

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await uploadToCloudinary(req.file.path, 'profiles');
      imageUrl = result.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    // Update user profile
    const user = await User.findById(req.user._id);
    user.profileImage = imageUrl;
    await user.save();

    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Upload card image
// @route   POST /api/upload/card
// @access  Private
router.post('/card', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl = `/uploads/${req.file.filename}`;

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await uploadToCloudinary(req.file.path, 'cards');
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
