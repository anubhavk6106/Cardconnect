require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/database');
const { initializeSocket } = require('./services/socketService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const cardRoutes = require('./routes/cardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/payment');
const analyticsRoutes = require('./routes/analyticsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const kycRoutes = require('./routes/kycRoutes');

// Initialize express and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Connect to MongoDB
connectDB();

// ✅ Define allowed CORS origin dynamically
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// ✅ Apply CORS
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (uploads, etc.)
app.use('/uploads', express.static('uploads'));

// ✅ Initialize Socket.io with proper CORS
initializeSocket(server, allowedOrigin);

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/kyc', kycRoutes);

// ✅ Health check route (for testing deployment)
app.get('/', (req, res) => {
  res.json({
    message: '🚀 CardConnect API is running successfully!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ✅ 404 route handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Use Render-assigned PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Allowed Origin: ${allowedOrigin}`);
  console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
});
