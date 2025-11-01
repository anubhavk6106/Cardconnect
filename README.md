# CardConnect 💳

A modern web platform connecting card owners with buyers to facilitate discounted product purchases through card-based transactions.

## 📋 Overview

CardConnect enables card owners to list their credit/debit cards with available discounts and buyers to browse these cards to make purchases at discounted prices. The platform handles secure transactions, real-time chat, payment processing, and comprehensive analytics.

## ✨ Features

### For Buyers 🛒
- Browse 24+ products from Amazon, Flipkart, and Myntra
- View available bank card discounts for each product
- Filter products by platform, category, price range, and search
- Browse available cards with discount information
- Filter by platform (Amazon, Flipkart, Swiggy, etc.), card network, and bank
- Request transactions with card owners for discounted purchases
- Secure payment processing via Razorpay
- Live chat with card owners
- Transaction history and savings tracking
- KYC verification system

### For Card Owners 💳
- Add cards with basic details (Bank, Type, Network, Last 4 digits, Expiry)
- Add platform-specific discounts (Amazon, Flipkart, Myntra, Swiggy, Zomato, etc.)
- Set discount percentages, max discount amounts, and validity periods
- Set usage limits and availability
- Track earnings and card performance
- Manage transaction requests
- Real-time notifications for new requests
- Chat with buyers
- Analytics dashboard

### For Admins 👑
- User management (activate/deactivate accounts)
- Transaction monitoring and oversight
- KYC verification approval/rejection
- Platform analytics and statistics
- System-wide notifications

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io Client** for real-time features
- **Chart.js** for analytics visualization
- **CSS3** for responsive styling

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time notifications
- **Razorpay** for payment gateway
- **Cloudinary** for image storage
- **Multer** for file uploads
- **Nodemailer** for email notifications

## 📁 Project Structure

```
CardConnect/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Image storage config
│   │   └── multer.js            # File upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cardController.js
│   │   ├── transactionController.js
│   │   ├── chatController.js
│   │   ├── notificationController.js
│   │   ├── adminController.js
│   │   ├── analyticsController.js
│   │   ├── kycController.js
│   │   ├── paymentController.js
│   │   └── searchController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Card.js
│   │   ├── Transaction.js
│   │   ├── Chat.js
│   │   ├── Notification.js
│   │   └── KYC.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cardRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── kycRoutes.js
│   │   ├── payment.js
│   │   ├── searchRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── services/
│   │   ├── socketService.js     # Real-time notifications
│   │   ├── emailService.js      # Email notifications
│   │   └── aiService.js         # AI features
│   ├── scripts/
│   │   ├── createAdmin.js       # Create admin user
│   │   ├── listUsers.js         # List all users
│   │   └── seed.js              # Seed sample data
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   └── VerifiedBadge.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── BuyerDashboard.jsx
│   │   │   ├── CardOwnerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── BrowseProducts.jsx
│   │   │   ├── ProductBrowseEnhanced.jsx
│   │   │   ├── TransactionHistory.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── KYCVerification.jsx
│   │   │   ├── KYCAdminPanel.jsx
│   │   │   └── ProfileSettings.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Razorpay account (for payments)
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=your_mongodb_atlas_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Email (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create admin user:**
   ```bash
   node scripts/createAdmin.js
   ```
   Default credentials: `admin@cardconnect.com` / `admin123`

5. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## 🔐 User Roles

### Buyer
- Browse and purchase products using available cards
- Chat with card owners
- Track transactions and savings
- Complete KYC verification

### Card Owner
- List cards with discount information
- Manage card availability and usage limits
- Process transaction requests
- Track earnings and performance
- Chat with buyers

### Admin
- Manage users and transactions
- Approve/reject KYC verifications
- View platform analytics
- Send system notifications

## 💳 Supported Platforms

- Amazon
- Flipkart
- Swiggy
- Zomato
- BookMyShow
- MakeMyTrip
- Myntra
- Nykaa
- BigBasket
- And more...

## 📊 Key Flows

### Transaction Flow
1. Buyer browses available cards
2. Selects a card with desired discount
3. Enters product details (name, price, platform)
4. Initiates payment via Razorpay
5. Card owner receives notification
6. Card owner places order and confirms
7. Transaction completes with commission split

### Chat System
- Real-time messaging using Socket.io
- Automatic chat creation per transaction
- Message history and read receipts
- Notifications for new messages

### KYC Verification
1. User submits KYC documents (Aadhar, PAN)
2. Admin reviews submission
3. Approval/rejection with feedback
4. Verified badge on profile

## 🛠️ Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed sample data
node scripts/createAdmin.js  # Create admin user
node scripts/listUsers.js    # List all users
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with role-based access
- CORS enabled for API security
- Secure payment processing via Razorpay
- Image validation and size limits
- MongoDB injection prevention

## 📱 Real-time Features

- Live notifications for new transactions
- Real-time chat messaging
- Transaction status updates
- Card availability updates
- Socket.io implementation for instant communication

## 🎨 UI Features

- Responsive design for all devices
- Modern card-based layout
- Interactive dashboards with charts
- Real-time notification bell
- Image upload with preview
- Loading states and error handling
- Toast notifications

## 📈 Analytics

- Total revenue and transaction count
- User growth over time
- Transaction trends
- Card performance metrics
- Top performing cards and users
- Platform-wise transaction breakdown

## 🐛 Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check Socket.io CORS configuration in `socketService.js`

### Database Connection
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network access permissions

### Payment Issues
- Verify Razorpay API keys
- Check test mode vs live mode
- Ensure webhook configuration

## 📝 API Documentation

Base URL: `http://localhost:5000/api`

### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (Protected)
- `PUT /auth/profile` - Update profile (Protected)

### Card Routes
- `GET /cards` - Get all available cards
- `POST /cards` - Create new card (Card Owner)
- `PUT /cards/:id` - Update card (Card Owner)
- `DELETE /cards/:id` - Delete card (Card Owner)

### Transaction Routes
- `GET /transactions` - Get user transactions
- `POST /transactions` - Create transaction (Buyer)
- `PUT /transactions/:id` - Update transaction status
- `GET /transactions/:id` - Get transaction details

### Chat Routes
- `GET /chat` - Get all chats
- `POST /chat/create` - Create new chat
- `POST /chat/:chatId/messages` - Send message
- `PUT /chat/:chatId/read` - Mark as read

### Admin Routes
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/status` - Update user status
- `GET /admin/transactions` - Get all transactions

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the project maintainer.

## 📄 License

Private and Confidential

## 👨‍💻 Developer

Developed as a full-stack MERN application for connecting card owners with buyers for discounted purchases.

## 📞 Support

For support and queries, contact the admin at: admin@cardconnect.com

---

**Note:** Remember to change default admin password and keep all API keys secure. Never commit `.env` files to version control.
