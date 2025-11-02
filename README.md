# CardConnect 💳

[![Node.js](https://img.shields.io/badge/Node.js-v16%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-black)](https://socket.io/)

A modern, full-stack web platform connecting card owners with buyers to facilitate discounted product purchases through card-based transactions. Built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time communication, secure payments, and comprehensive analytics.

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
- **React 18.2.0** with **Vite 5.4.21** for fast development and optimized builds
- **React Router DOM 6.20.1** for client-side routing and navigation
- **Axios 1.6.2** for HTTP requests and API communication
- **Socket.io Client 4.8.1** for real-time bidirectional event-based communication
- **Chart.js 4.5.1** with **React-ChartJS-2 5.3.1** for interactive data visualization
- **CSS3** with custom responsive styling (no UI framework dependency)
- **Context API** for global state management (AuthContext)

### Backend
- **Node.js** with **Express.js 4.18.2** REST API framework
- **MongoDB Atlas** with **Mongoose 8.0.3** ODM for database operations
- **JWT (jsonwebtoken 9.0.2)** for stateless authentication and authorization
- **bcryptjs 2.4.3** for secure password hashing with salt
- **Socket.io 4.8.1** for WebSocket-based real-time notifications and chat
- **Razorpay 2.9.6** integration for secure payment processing
- **Cloudinary 1.41.3** for cloud-based image storage and CDN delivery
- **Multer 1.4.5-lts.1** for handling multipart/form-data file uploads
- **Nodemailer 6.10.1** for transactional email notifications
- **Express-validator 7.0.1** for request validation and sanitization
- **CORS 2.8.5** for cross-origin resource sharing configuration

### Development Tools
- **Nodemon 3.0.2** for automatic server restarts during development
- **Concurrently 8.2.2** for running frontend and backend simultaneously
- **dotenv 16.3.1** for environment variable management

## 📁 Project Structure

```
CardConnect/
├── backend/                      # Node.js/Express backend server
│   ├── config/                   # Configuration files
│   │   ├── database.js          # MongoDB Atlas connection setup
│   │   ├── cloudinary.js        # Cloudinary image storage config
│   │   └── multer.js            # File upload middleware config
│   ├── controllers/              # Business logic layer (MVC pattern)
│   │   ├── authController.js    # User authentication & registration
│   │   ├── cardController.js    # Card CRUD operations
│   │   ├── transactionController.js  # Transaction management
│   │   ├── chatController.js    # Real-time chat functionality
│   │   ├── notificationController.js # Notification handling
│   │   ├── adminController.js   # Admin-specific operations
│   │   ├── analyticsController.js    # Analytics & statistics
│   │   ├── kycController.js     # KYC verification logic
│   │   ├── paymentController.js # Razorpay payment integration
│   │   └── searchController.js  # Search & filtering logic
│   ├── models/                   # Mongoose schemas & models
│   │   ├── User.js              # User model (buyer/card_owner/admin roles)
│   │   ├── Card.js              # Card model with discount details
│   │   ├── Transaction.js       # Transaction model with status tracking
│   │   ├── Chat.js              # Chat & message schema
│   │   ├── Notification.js      # Notification model
│   │   └── KYC.js               # KYC verification data model
│   ├── routes/                   # Express route definitions
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   ├── cardRoutes.js        # /api/cards endpoints
│   │   ├── transactionRoutes.js # /api/transactions endpoints
│   │   ├── chatRoutes.js        # /api/chat endpoints
│   │   ├── notificationRoutes.js # /api/notifications endpoints
│   │   ├── adminRoutes.js       # /api/admin endpoints
│   │   ├── analyticsRoutes.js   # /api/analytics endpoints
│   │   ├── kycRoutes.js         # /api/kyc endpoints
│   │   ├── payment.js           # /api/payment endpoints
│   │   ├── searchRoutes.js      # /api/search endpoints
│   │   ├── uploadRoutes.js      # /api/upload endpoints
│   │   └── aiRoutes.js          # /api/ai endpoints (future AI features)
│   ├── middleware/
│   │   └── auth.js              # JWT token verification & role-based access
│   ├── services/                 # External service integrations
│   │   ├── socketService.js     # Socket.io server & event handlers
│   │   ├── emailService.js      # Nodemailer email service
│   │   └── aiService.js         # AI/ML service integration
│   ├── scripts/                  # Utility scripts
│   │   ├── createAdmin.js       # Script to create admin user
│   │   ├── listUsers.js         # Script to list all users
│   │   └── seed.js              # Database seeding script
│   ├── uploads/                  # Local file storage (temp)
│   ├── .env                      # Environment variables (not in git)
│   ├── server.js                 # Express server entry point
│   └── package.json              # Backend dependencies
│
├── frontend/                     # React/Vite frontend application
│   ├── dist/                     # Production build output
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── Navbar.jsx       # Navigation bar with auth state
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── PrivateRoute.jsx # Protected route wrapper (HOC)
│   │   │   ├── NotificationBell.jsx # Real-time notification bell
│   │   │   ├── ImageUpload.jsx  # Image upload component
│   │   │   ├── PaymentModal.jsx # Razorpay payment modal
│   │   │   └── VerifiedBadge.jsx # KYC verification badge
│   │   ├── pages/               # Page-level components (routes)
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # User login
│   │   │   ├── Register.jsx     # User registration
│   │   │   ├── BuyerDashboard.jsx       # Buyer main dashboard
│   │   │   ├── CardOwnerDashboard.jsx   # Card owner dashboard
│   │   │   ├── AdminDashboard.jsx       # Admin control panel
│   │   │   ├── AnalyticsDashboard.jsx   # Analytics & charts
│   │   │   ├── BrowseProducts.jsx       # Product browsing page
│   │   │   ├── ProductBrowseEnhanced.jsx # Enhanced product browser
│   │   │   ├── TransactionHistory.jsx   # Transaction list & details
│   │   │   ├── ChatPage.jsx     # Real-time chat interface
│   │   │   ├── KYCVerification.jsx      # KYC submission form
│   │   │   ├── KYCAdminPanel.jsx        # KYC approval panel (admin)
│   │   │   └── ProfileSettings.jsx      # User profile management
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state (Context API)
│   │   ├── assets/              # Static assets (images, icons)
│   │   ├── styles/              # CSS modules
│   │   ├── App.jsx              # Root component & routing
│   │   ├── App.css              # Global styles
│   │   ├── App.design.css       # Design system styles
│   │   ├── index.css            # Base styles
│   │   └── main.jsx             # React entry point
│   ├── .env                      # Frontend environment variables
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   └── package.json              # Frontend dependencies
│
├── .gitignore                    # Git ignore rules
├── package.json                  # Root package.json for concurrent scripts
└── README.md                     # Project documentation
```

## 🗄️ Database Schema

### User Model
- **Fields**: name, email, password (hashed), role, phone, address, profileImage
- **Verification**: isVerified, status (none/pending/under_review/approved/rejected), level, kycId
- **Stats**: totalTransactions, totalSavings, totalEarnings
- **Roles**: buyer, card_owner, admin

### Card Model
- **Fields**: owner (ref: User), bankName, cardType, cardNetwork, lastFourDigits, expiryDate, cardImage
- **Discounts**: Array of platform-specific discounts (platform, discountPercentage, maxDiscount, minPurchase, validUntil)
- **Usage**: isAvailable, usageLimit, currentUsage, rating, totalTransactions
- **Networks**: Visa, Mastercard, RuPay, American Express

### Transaction Model
- **Relationships**: buyer (ref: User), cardOwner (ref: User), card (ref: Card)
- **Details**: productName, productPrice, platform, requestedDiscount
- **Payment**: paymentAmount, paymentStatus, razorpayOrderId, razorpayPaymentId
- **Status**: pending, accepted, rejected, completed, cancelled
- **Tracking**: commission, orderPlaced, timestamps

### Chat Model
- **Participants**: buyer, cardOwner (refs to User)
- **Messages**: Array of {sender, message, timestamp, isRead}
- **Metadata**: lastMessage, unreadCount, transaction (ref)

### KYC Model
- **User**: userId (ref: User)
- **Documents**: aadharNumber, panNumber, documentImages
- **Status**: pending, under_review, approved, rejected
- **Verification**: verifiedBy (ref: User), verificationDate, comments

### Notification Model
- **Fields**: user (ref: User), type, title, message, isRead, link
- **Types**: transaction, message, kyc, system

## 🎯 Core Features Breakdown

### 1. Authentication & Authorization
- JWT-based stateless authentication with httpOnly cookies
- Role-based access control (RBAC) for buyer/card_owner/admin
- Password hashing using bcrypt with salt rounds
- Protected routes with PrivateRoute HOC component
- Session persistence with localStorage token management

### 2. Real-time Communication
- **Socket.io Integration**: Bidirectional WebSocket communication
- **Live Chat**: One-on-one messaging between buyers and card owners
- **Notifications**: Real-time push notifications for transactions, messages, KYC updates
- **Presence System**: Online/offline status tracking
- **Event-driven**: Socket events for new transactions, messages, status updates

### 3. Payment Processing
- **Razorpay Integration**: Secure payment gateway with test/live modes
- **Order Creation**: Server-side order generation with amount verification
- **Payment Verification**: Signature verification for transaction security
- **Commission Split**: Automatic commission calculation and distribution
- **Transaction Tracking**: Complete payment lifecycle management

### 4. File Upload & Storage
- **Cloudinary Integration**: Cloud-based image storage with CDN
- **Multer Middleware**: Handles multipart/form-data file uploads
- **Image Validation**: File type and size validation
- **Automatic Optimization**: Image compression and transformation
- **Upload Types**: Profile images, card images, KYC documents

### 5. KYC Verification System
- **Document Upload**: Aadhar and PAN document submission
- **Admin Review**: Dedicated admin panel for verification
- **Status Tracking**: none → pending → under_review → approved/rejected
- **Verification Levels**: none, basic, verified, premium
- **Badge System**: Visual verification badges on profiles

### 6. Analytics & Reporting
- **Chart.js Visualization**: Interactive charts and graphs
- **Revenue Tracking**: Total revenue and transaction count
- **User Growth**: Time-series user registration data
- **Platform Performance**: Transaction breakdown by platform
- **Card Analytics**: Top performing cards and success rates

### 7. Search & Filtering
- **Multi-criteria Search**: Filter by platform, bank, card network, price range
- **Product Search**: Search across 24+ products from multiple platforms
- **Card Discovery**: Browse available cards with active discounts
- **Real-time Filtering**: Instant results with client-side filtering
- **Sort Options**: Sort by discount, rating, popularity

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

## 🔄 Development Workflow

### Running Both Servers Concurrently
```bash
# From root directory
npm run dev
# Runs both backend (port 5000) and frontend (port 5173) simultaneously
```

### Running Servers Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Database Management
```bash
# Seed sample data (products, cards, users)
cd backend
npm run seed

# Create admin user
node scripts/createAdmin.js

# List all users
node scripts/listUsers.js
```

## 🏗️ Architecture Overview

### Backend Architecture
- **MVC Pattern**: Separation of concerns (Models, Views, Controllers)
- **RESTful API**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Middleware Chain**: CORS → JSON Parser → Auth → Route Handlers
- **Error Handling**: Centralized error handling middleware
- **Service Layer**: External service integrations (Socket, Email, Payment)

### Frontend Architecture
- **Component-based**: Modular React components with single responsibility
- **Context API**: Global authentication state management
- **React Router**: Client-side routing with protected routes
- **Custom Hooks**: Reusable logic (useAuth, useSocket, useNotifications)
- **Responsive Design**: Mobile-first CSS with flexbox/grid layouts

### Real-time Communication Flow
```
Client (Socket.io Client) ←→ Server (Socket.io Server) ←→ MongoDB
     ↓                              ↓
Emit Events                    Broadcast to Rooms
(new-message, transaction)     (user-specific notifications)
```

### Payment Flow
```
1. Buyer initiates transaction → Backend creates Razorpay order
2. Frontend opens Razorpay modal → User completes payment
3. Razorpay returns payment details → Backend verifies signature
4. Payment success → Update transaction status → Notify card owner
5. Commission calculation → Update user stats → Send emails
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login flow
- [ ] Card creation with discount details
- [ ] Product browsing and filtering
- [ ] Transaction initiation and payment
- [ ] Real-time chat messaging
- [ ] Notification delivery
- [ ] KYC document upload and approval
- [ ] Admin user management
- [ ] Analytics dashboard data accuracy

### API Testing
Use tools like Postman or Thunder Client:
```bash
# Test authentication
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login

# Test protected routes (add JWT token in Authorization header)
GET http://localhost:5000/api/cards
POST http://localhost:5000/api/transactions
```

## 🐛 Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL (http://localhost:5173)
- Check Socket.io CORS configuration in `services/socketService.js`
- Verify `cors()` middleware is applied before routes in `server.js`

### Database Connection Issues
- Verify MongoDB Atlas connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure network access permissions in Atlas dashboard
- Test connection with MongoDB Compass

### Payment Issues
- Verify Razorpay API keys (Key ID and Key Secret)
- Check test mode vs live mode (use test keys for development)
- Ensure webhook URLs are configured in Razorpay dashboard
- Check browser console for Razorpay script loading errors

### Socket.io Connection Issues
- Check CORS configuration allows frontend origin
- Verify Socket.io client version matches server version (4.8.1)
- Check browser console for WebSocket connection errors
- Ensure server is running before connecting client

### Image Upload Issues
- Verify Cloudinary credentials (Cloud Name, API Key, API Secret)
- Check file size limits in Multer configuration
- Ensure `uploads/` directory exists with write permissions
- Verify file type validation (only images allowed)

### Environment Variable Issues
- Ensure `.env` files exist in both backend and frontend directories
- Restart servers after changing `.env` files
- Frontend variables must start with `VITE_` prefix
- Never commit `.env` files to version control

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

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)
1. Push code to GitHub repository
2. Connect repository to deployment platform
3. Add all environment variables from `.env`
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Update CORS to allow production frontend URL

### Frontend Deployment (Vercel/Netlify)
1. Connect repository to deployment platform
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables (VITE_API_URL, VITE_RAZORPAY_KEY_ID)
5. Configure redirects for React Router (SPA)

### Production Checklist
- [ ] Change default admin password
- [ ] Use production MongoDB cluster
- [ ] Switch Razorpay to live mode
- [ ] Enable HTTPS/SSL certificates
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up database backups
- [ ] Implement rate limiting

## 🔐 Security Best Practices

- ✅ JWT tokens stored in httpOnly cookies (prevents XSS)
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ MongoDB injection prevention with Mongoose
- ✅ CORS properly configured
- ✅ Input validation and sanitization (express-validator)
- ✅ File upload validation (type, size limits)
- ✅ Environment variables for sensitive data
- ✅ Secure payment processing via Razorpay
- 🔲 Rate limiting (TODO: implement in production)
- 🔲 Helmet.js for HTTP headers (TODO: add)

## 📈 Performance Optimizations

### Backend
- Database indexing on frequently queried fields (email, userId)
- Efficient MongoDB queries with projection and lean()
- Connection pooling for database connections
- Static file serving with proper caching headers

### Frontend
- Vite for fast development and optimized production builds
- Code splitting with React.lazy() (TODO)
- Image optimization via Cloudinary CDN
- CSS optimization and minification
- React Context API for minimal re-renders

## 🛣️ Roadmap & Future Enhancements

### Planned Features
- [ ] **AI-powered Recommendations**: Smart card suggestions based on purchase history
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Mobile Apps**: React Native iOS/Android apps
- [ ] **Advanced Analytics**: ML-based insights and predictions
- [ ] **Referral System**: User referral program with rewards
- [ ] **Automated Testing**: Jest/Mocha unit tests, Cypress E2E tests
- [ ] **API Rate Limiting**: Express rate limiter middleware
- [ ] **Caching Layer**: Redis for session and data caching
- [ ] **Email Templates**: Rich HTML email templates
- [ ] **Push Notifications**: FCM for mobile push notifications
- [ ] **Advanced Search**: Elasticsearch integration
- [ ] **Invoice Generation**: Automated PDF invoices

### Current Limitations
- No automated testing suite
- Single server deployment (no load balancing)
- Limited to Indian payment gateway (Razorpay)
- No data export functionality
- Manual KYC verification (no OCR)

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the project maintainer.

### Development Guidelines
- Follow existing code structure and naming conventions
- Write descriptive commit messages
- Test changes thoroughly before committing
- Update documentation for new features
- Follow ESLint rules and code formatting standards

## 📄 License

Private and Confidential

## 👨‍💻 Developer

Developed as a full-stack MERN application for connecting card owners with buyers for discounted purchases.

**Tech Stack Summary**: MongoDB Atlas + Express.js + React 18 + Node.js + Socket.io + Razorpay + Cloudinary

## 📞 Support

For support and queries, contact the admin at: admin@cardconnect.com

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Documentation](https://react.dev/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**⚠️ Important Security Notes:**
- Change default admin password immediately after setup
- Keep all API keys and secrets secure
- Never commit `.env` files to version control
- Use environment-specific configurations
- Regularly update dependencies for security patches
- Enable 2FA on all third-party service accounts

**💡 Quick Start Reminder:**
```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev

# Backend: http://localhost:5000
# Frontend: http://localhost:5173
```

---

*Last Updated: November 2025 | Version 1.0.0*
