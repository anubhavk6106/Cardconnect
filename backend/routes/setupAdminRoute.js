const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/create-admin", async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("       ADMIN USER CREATOR (REMOTE)");
    console.log("========================================\n");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(200).json({
        message: "⚠️ Admin already exists",
        email: existingAdmin.email,
        name: existingAdmin.name,
      });
    }

    // Create admin
    const adminData = {
      name: "Admin",
      email: "admin@cardconnect.com",
      password: "admin123",
      role: "admin",
      phone: "1234567890",
      address: {
        street: "Admin Street",
        city: "Admin City",
        state: "Admin State",
        pincode: "000000",
      },
      isActive: true,
    };

    const admin = await User.create(adminData);

    console.log("✅ Admin created successfully!");
    res.status(201).json({
      message: "✅ Admin user created successfully!",
      credentials: {
        email: "admin@cardconnect.com",
        password: "admin123",
      },
    });
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    res.status(500).json({ message: "Error creating admin", error: error.message });
  }
});

module.exports = router;
