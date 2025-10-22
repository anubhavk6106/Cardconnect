# CardConnect - Bank Card Discount Sharing Platform

## 🎯 Project Overview

CardConnect is a comprehensive full-stack MERN (MongoDB, Express, React, Node.js) web platform that revolutionizes access to bank-specific discounts on major e-commerce platforms. Users can leverage exclusive bank card offers from Amazon, Flipkart, and Myntra without owning the actual cards. The platform facilitates a secure marketplace connecting **Buyers** seeking discounts with **Card Owners** willing to share their card benefits for a fee, creating a win-win ecosystem.

### 🌟 Problem Statement

Many e-commerce platforms offer exclusive discounts tied to specific bank cards (HDFC, SBI, ICICI, etc.), but users without these cards miss out on significant savings. CardConnect solves this by:
- Enabling buyers to access any bank card discount
- Allowing card owners to monetize their unused card benefits
- Creating a secure, transparent transaction ecosystem
- Providing AI-powered matching for optimal user experience

### 🎨 Key Features

#### User Management
- **Three User Roles**: Buyers, Card Owners, and Admins with role-based access control
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Profile Management**: Users can update profile, upload images, and manage preferences
- **Email Verification**: Automated email notifications for account activities

#### Transaction System
- **Secure Transaction Flow**: Request → Approval → Payment → Completion workflow
- **Payment Integration**: Razorpay integration for secure online payments
- **Transaction History**: Complete audit trail of all transactions
- **Rating System**: Buyers can rate and review card owners
- **Revenue Sharing**: Automatic split (85% to card owner, 15% platform fee)

#### Real-time Features
- **Socket.io Integration**: Real-time bidirectional communication
- **Live Notifications**: Instant updates for transaction events
- **In-app Notification Bell**: Real-time notification center with unread counts
- **Browser Push Notifications**: Desktop notifications for critical events
- **Email Notifications**: Automated emails via Nodemailer for all key actions

#### AI & Smart Features
- **AI-Powered Card Matching**: Intelligent algorithm matches buyers with optimal card owners
- **Product Recommendations**: Personalized product suggestions based on user behavior
- **Transaction Success Prediction**: ML-based success rate predictions
- **Search & Filters**: Advanced search with multiple filter options

#### Admin Features
- **Analytics Dashboard**: Real-time platform statistics and insights
- **User Management**: Activate/deactivate users, view all user details
- **Transaction Monitoring**: Monitor all platform transactions
- **Card Management**: View and manage all listed cards
- **Revenue Tracking**: Track platform earnings and revenue metrics

#### Technical Features
- **Responsive Design**: Mobile-first, works seamlessly on all devices
- **Image Upload**: Cloudinary integration for product/profile images
- **Data Seeding**: Automated test data generation for development
- **Error Handling**: Comprehensive error handling and validation
- **Security**: CORS protection, input validation, SQL injection prevention

## 🏗️ Tech Stack

### Frontend Technologies
- **React 18.2.0** - Modern UI library with hooks and functional components
- **Vite 5.4.21** - Lightning-fast development server and build tool
- **React Router DOM 6.20.1** - Declarative client-side routing
- **Axios 1.6.2** - Promise-based HTTP client for API requests
- **Socket.io Client 4.8.1** - Real-time bidirectional event-based communication
- **CSS3** - Custom responsive styling with Flexbox and Grid

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Minimal and flexible Node.js web framework
- **MongoDB** - NoSQL document database
- **Mongoose 8.0.3** - Elegant MongoDB object modeling (ODM)
- **JWT (jsonwebtoken 9.0.2)** - Stateless authentication tokens
- **bcryptjs 2.4.3** - Password hashing with salt

### Real-time & Communication
- **Socket.io 4.8.1** - Real-time engine for live notifications
- **Nodemailer 6.10.1** - Email sending for transaction notifications

### File Management
- **Multer 1.4.5** - Middleware for handling multipart/form-data
- **Cloudinary 1.41.3** - Cloud-based image and video management

### Payment Gateway
- **Razorpay 2.9.6** - Payment gateway integration for secure transactions

### Validation & Security
- **express-validator 7.0.1** - Middleware for request validation
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 16.3.1** - Environment variable management

### Development Tools
- **Nodemon 3.0.2** - Auto-restart server on file changes
- **Concurrently 8.2.2** - Run multiple commands simultaneously

### AI & ML Features
- **Custom Matching Algorithm**: Scores and ranks card owners based on:
  - Card availability and status
  - Historical transaction success rate
  - User ratings and reviews
  - Response time and reliability
- **Product Recommendation Engine**: Suggests products based on:
  - User browsing history
  - Transaction patterns
  - Popular products in user's category
- **Transaction Success Prediction**: ML model predicting completion probability

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/cloud/atlas)
- **Git** - For version control
- **Code Editor** - VS Code recommended
- **Cloudinary Account** (Optional) - For image uploads
- **Razorpay Account** (Optional) - For payment integration

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd CardConnect

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/cardconnect?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Admin Credentials
ADMIN_EMAIL=admin@cardconnect.com
ADMIN_PASSWORD=Admin@123

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=CardConnect <noreply@cardconnect.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Replace all `YOUR_*` placeholders with actual credentials
- For Gmail, use [App-Specific Password](https://support.google.com/accounts/answer/185833)
- Keep `.env` file secure and never commit to Git

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or allow access from anywhere for development: 0.0.0.0/0)
5. Get your connection string and update `.env`

### 4. Seed Database with Test Data (Optional but Recommended)

Run the seed script to populate your database with sample users and cards:

```bash
cd backend
npm run seed
```

This will create:
- 1 Admin account
- 3 Card Owners with 7 cards total
- 2 Buyer accounts

**Test Credentials:**
- Admin: `admin@cardconnect.com` / `Admin@123`
- Card Owners: `rajesh@example.com`, `priya@example.com`, `amit@example.com` / `password123`
- Buyers: `sneha@example.com`, `vikram@example.com` / `password123`

### 5. Start the Application

#### Option A: Run Both Servers Simultaneously

```bash
# From root directory
npm run dev
```

#### Option B: Run Servers Separately

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 User Roles & Features

### Buyer
- Browse available cards with discounts
- View AI-powered product recommendations
- Request transactions for specific products
- Track transaction status
- Rate and review card owners

### Card Owner
- List multiple bank cards with discount details
- Approve/reject buyer requests
- Track earnings from transactions
- Manage card availability
- View transaction history and ratings

### Admin
- View platform statistics and analytics
- Manage all users (activate/deactivate)
- Monitor all transactions
- View all cards listed on platform
- Track platform revenue

## 🔄 Transaction Workflow

```
1. Buyer finds a card with desired discount
   ↓
2. Buyer creates transaction request with product details
   ↓
3. Card Owner receives notification
   ↓
4. Card Owner approves or rejects request
   ↓
5. If approved, buyer completes purchase
   ↓
6. Buyer marks transaction as complete and rates owner
   ↓
7. Platform distributes earnings (85% to owner, 15% platform fee)
```

## 📊 Project Structure

```
CardConnect/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   ├── database.js            # MongoDB connection setup
│   │   └── multer.js              # Multer file upload config
│   │
│   ├── controllers/
│   │   ├── adminController.js     # Admin dashboard & management
│   │   ├── authController.js      # Login, register, profile
│   │   ├── cardController.js      # CRUD operations for cards
│   │   ├── notificationController.js  # Notification management
│   │   ├── paymentController.js   # Razorpay integration
│   │   ├── searchController.js    # Search & filter logic
│   │   └── transactionController.js   # Transaction lifecycle
│   │
│   ├── middleware/
│   │   └── auth.js                # JWT verification & role checks
│   │
│   ├── models/
│   │   ├── Card.js                # Card schema with bank details
│   │   ├── Notification.js        # Notification schema
│   │   ├── Product.js             # Product catalog schema
│   │   ├── Transaction.js         # Transaction with status tracking
│   │   └── User.js                # User schema (buyer/owner/admin)
│   │
│   ├── routes/
│   │   ├── adminRoutes.js         # /api/admin/* endpoints
│   │   ├── aiRoutes.js            # /api/ai/* endpoints
│   │   ├── authRoutes.js          # /api/auth/* endpoints
│   │   ├── cardRoutes.js          # /api/cards/* endpoints
│   │   ├── notificationRoutes.js  # /api/notifications/* endpoints
│   │   ├── payment.js             # /api/payment/* endpoints
│   │   ├── searchRoutes.js        # /api/search/* endpoints
│   │   ├── transactionRoutes.js   # /api/transactions/* endpoints
│   │   └── uploadRoutes.js        # /api/upload/* endpoints
│   │
│   ├── scripts/
│   │   ├── listUsers.js           # Utility to list all users
│   │   └── seed.js                # Database seeding script
│   │
│   ├── services/
│   │   ├── aiService.js           # AI matching & recommendations
│   │   ├── emailService.js        # Nodemailer email service
│   │   └── socketService.js       # Socket.io real-time events
│   │
│   ├── uploads/                   # Uploaded images storage
│   │   └── .gitkeep
│   │
│   ├── .env                       # Environment variables (not in git)
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx & .css  # Footer component
│   │   │   ├── ImageUpload.jsx & .css  # Image upload component
│   │   │   ├── Navbar.jsx & .css  # Navigation bar
│   │   │   ├── NotificationBell.jsx    # Real-time notifications
│   │   │   ├── PaymentModal.jsx & .css # Payment UI modal
│   │   │   └── PrivateRoute.jsx   # Protected route wrapper
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global authentication state
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # Admin analytics & management
│   │   │   ├── BuyerDashboard.jsx # Buyer overview & actions
│   │   │   ├── CardOwnerDashboard.jsx  # Card owner panel
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── ProductBrowseEnhanced.jsx  # Main product browse
│   │   │   ├── ProfileSettings.jsx & .css # User profile management
│   │   │   ├── Register.jsx       # Registration form
│   │   │   └── TransactionHistory.jsx # Transaction list & details
│   │   │
│   │   ├── App.css                # Global app styles
│   │   ├── App.jsx                # Root component with routes
│   │   ├── index.css              # Base CSS reset & variables
│   │   └── main.jsx               # React DOM render entry
│   │
│   ├── index.html                 # HTML template
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
│
├── .gitignore                     # Git ignore rules
├── package.json                   # Root package with concurrent scripts
└── README.md                      # This file
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/register` | Register new user | ❌ | - |
| POST | `/login` | Login user and get JWT token | ❌ | - |
| GET | `/profile` | Get logged-in user profile | ✅ | Any |
| PUT | `/profile` | Update user profile | ✅ | Any |
| POST | `/logout` | Logout user | ✅ | Any |

### Cards (`/api/cards`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all available cards | ✅ | Buyer |
| GET | `/:id` | Get specific card details | ✅ | Any |
| POST | `/` | Create new card listing | ✅ | Card Owner |
| GET | `/owner/:ownerId` | Get cards by owner | ✅ | Any |
| GET | `/my-cards` | Get logged-in owner's cards | ✅ | Card Owner |
| PUT | `/:id` | Update card details | ✅ | Card Owner |
| DELETE | `/:id` | Delete card | ✅ | Card Owner |
| PUT | `/:id/toggle-status` | Activate/deactivate card | ✅ | Card Owner |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get user's transactions | ✅ | Any |
| POST | `/` | Create transaction request | ✅ | Buyer |
| GET | `/:id` | Get specific transaction | ✅ | Any |
| PUT | `/:id/approve` | Approve transaction | ✅ | Card Owner |
| PUT | `/:id/reject` | Reject transaction | ✅ | Card Owner |
| PUT | `/:id/complete` | Mark transaction complete | ✅ | Buyer |
| PUT | `/:id/cancel` | Cancel transaction | ✅ | Buyer |
| POST | `/:id/rate` | Rate and review card owner | ✅ | Buyer |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/stats` | Get platform statistics | ✅ | Admin |
| GET | `/users` | Get all users | ✅ | Admin |
| GET | `/users/:id` | Get specific user details | ✅ | Admin |
| PUT | `/users/:id` | Update user details | ✅ | Admin |
| DELETE | `/users/:id` | Delete user | ✅ | Admin |
| PUT | `/users/:id/toggle-status` | Activate/deactivate user | ✅ | Admin |
| GET | `/transactions` | Get all transactions | ✅ | Admin |
| GET | `/cards` | Get all cards | ✅ | Admin |
| GET | `/revenue` | Get revenue analytics | ✅ | Admin |

### AI Features (`/api/ai`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/match-cards` | Get AI-matched cards for buyer | ✅ | Buyer |
| GET | `/recommendations` | Get personalized products | ✅ | Buyer |
| GET | `/predict-success/:transactionId` | Predict transaction success | ✅ | Any |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get user's notifications | ✅ | Any |
| PUT | `/:id/read` | Mark notification as read | ✅ | Any |
| PUT | `/read-all` | Mark all as read | ✅ | Any |
| DELETE | `/:id` | Delete notification | ✅ | Any |

### Search (`/api/search`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/cards` | Search cards with filters | ✅ | Buyer |
| GET | `/products` | Search products | ✅ | Buyer |

### Payment (`/api/payment`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/create-order` | Create Razorpay order | ✅ | Buyer |
| POST | `/verify` | Verify payment signature | ✅ | Buyer |
| POST | `/refund` | Initiate refund | ✅ | Admin |

### Upload (`/api/upload`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/image` | Upload image to Cloudinary | ✅ | Any |
| DELETE | `/image/:publicId` | Delete image from Cloudinary | ✅ | Any |

## 🧪 Testing the Application

### 1. Create Admin Account

First, manually create an admin user in MongoDB or via API:

```javascript
// Using MongoDB Compass or Shell
db.users.insertOne({
  name: "Admin User",
  email: "admin@cardconnect.com",
  password: "$2a$10$HASHED_PASSWORD", // Use bcrypt to hash
  role: "admin",
  phone: "1234567890",
  isActive: true
})
```

### 2. Register Test Users

1. Register a **Card Owner**:
   - Go to registration page
   - Select "Card Owner" role
   - Fill in details and submit

2. Register a **Buyer**:
   - Register with "Buyer" role

### 3. Add Cards (Card Owner)

1. Login as card owner
2. Go to dashboard
3. Click "Add Card"
4. Enter card details and discount information
5. Submit

### 4. Create Transaction (Buyer)

1. Login as buyer
2. Browse available cards
3. Click "Request Transaction"
4. Enter product details
5. Submit request

### 5. Approve Transaction (Card Owner)

1. Login as card owner
2. View pending requests
3. Approve or reject

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Middleware protection
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for specific origins

## 🎨 UI/UX Highlights

- Clean, modern interface
- Intuitive navigation
- Responsive design for all devices
- Color-coded status indicators
- Real-time feedback on actions
- Professional color scheme

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

```bash
# Build command
cd backend && npm install

# Start command
node server.js

# Environment variables to set
- MONGODB_URI
- JWT_SECRET
- PORT
- FRONTEND_URL
- All API keys (Cloudinary, Razorpay, Email)
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build command
cd frontend && npm install && npm run build

# Output directory
frontend/dist

# Environment variables
- VITE_API_URL=https://your-backend-url.com
```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile.backend
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 5000
CMD ["node", "server.js"]

# Dockerfile.frontend
FROM node:16-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🚧 Future Enhancements

### Short-term (1-3 months)
1. ✅ ~~Payment Integration~~ - **Completed** (Razorpay integrated)
2. ✅ ~~Real-time Notifications~~ - **Completed** (Socket.io implemented)
3. ✅ ~~Email Notifications~~ - **Completed** (Nodemailer integrated)
4. 📍 **E-commerce API Integration** - Fetch real products from Amazon/Flipkart APIs
5. 📍 **Advanced Search** - Elasticsearch for better search performance
6. 📍 **Testing Suite** - Jest/Mocha for unit and integration tests

### Medium-term (3-6 months)
7. 📍 **Chat System** - Direct messaging between buyers and card owners
8. 📍 **Video KYC** - Identity verification for card owners
9. 📍 **Wallet System** - Internal wallet for faster transactions
10. 📍 **Dispute Resolution** - Automated dispute handling system
11. 📍 **Analytics Dashboard** - Advanced charts and insights (Chart.js/D3.js)
12. 📍 **Multi-language Support** - i18n internationalization

### Long-term (6-12 months)
13. 📍 **Mobile Apps** - React Native iOS and Android applications
14. 📍 **Advanced ML Models** - TensorFlow.js for better predictions
15. 📍 **Blockchain Integration** - Transparent transaction ledger
16. 📍 **Referral System** - Earn rewards for inviting friends
17. 📍 **Subscription Plans** - Premium features for card owners
18. 📍 **API Marketplace** - Public API for third-party integrations

## 💡 Key Learning Outcomes

This project demonstrates mastery of:

### Technical Skills
- **Full-Stack Development**: Complete MERN stack from scratch
- **RESTful API Design**: 40+ endpoints with proper HTTP methods and status codes
- **Database Design**: Complex MongoDB schemas with relationships
- **Authentication & Authorization**: JWT with role-based access control
- **Real-time Communication**: Socket.io for bidirectional events
- **Third-party Integration**: Razorpay, Cloudinary, Nodemailer
- **State Management**: React Context API for global state
- **File Upload**: Multer + Cloudinary for image handling

### Software Engineering Practices
- **MVC Architecture**: Separation of concerns (Models, Controllers, Routes)
- **Code Organization**: Modular, maintainable file structure
- **Error Handling**: Try-catch blocks with meaningful error messages
- **Security**: Password hashing, JWT tokens, input validation, CORS
- **Environment Configuration**: Secure credential management with dotenv
- **Version Control**: Git workflow and repository management

### Problem-Solving Approach
- **Business Logic**: Complex transaction workflow with multiple states
- **AI/ML Integration**: Custom scoring algorithms for matching
- **User Experience**: Role-specific dashboards and intuitive UI
- **Performance**: Efficient queries with MongoDB indexing
- **Scalability**: Designed for horizontal scaling

## 🎯 Unique Selling Points

1. **Real-World Problem**: Solves actual discount accessibility issues
2. **Three-Sided Marketplace**: Buyers, Card Owners, and Admin ecosystem
3. **AI-Powered Matching**: Intelligent card owner selection algorithm
4. **Complete Transaction Lifecycle**: Request → Payment → Completion → Review
5. **Real-time Features**: Live notifications and instant updates
6. **Payment Integration**: Actual money flow with Razorpay
7. **Production-Ready**: Deployable with proper security measures
8. **Scalable Architecture**: Can handle thousands of concurrent users

## 📝 Project Metrics

- **Lines of Code**: ~5,000+ (excluding node_modules)
- **API Endpoints**: 40+ RESTful endpoints
- **Database Collections**: 5 MongoDB collections
- **React Components**: 15+ reusable components
- **Features**: 30+ user-facing features
- **Development Time**: 4-6 weeks (estimated)
- **Technologies Used**: 15+ libraries and frameworks

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB URI format
# Ensure IP is whitelisted in Atlas
# Verify database user credentials
```

### Port Already in Use
```bash
# Change port in .env (backend) or vite.config.js (frontend)
# Or kill process using the port
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support & Contact

For questions, issues, or contributions:

- **Email**: support@cardconnect.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/cardconnect/issues)
- **Documentation**: This README and inline code comments

## 👨‍💻 Developer

**Created By**: [Your Name]
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Email**: your.email@example.com
- **Portfolio**: [yourportfolio.com](https://yourportfolio.com)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Educational Purpose**: This project is created as part of college coursework and for learning purposes.

## 🙏 Acknowledgments

- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Image hosting and management
- **Razorpay** - Payment gateway services
- **React Community** - Excellent documentation and support
- **Express.js Community** - Robust backend framework
- **Stack Overflow** - Problem-solving and debugging help
- **npm Package Contributors** - All the amazing open-source libraries
- **College Faculty** - Guidance and project mentorship

## 📚 References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Razorpay Integration Docs](https://razorpay.com/docs/)
- [JWT Best Practices](https://jwt.io/introduction)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**Made with ❤️ using MERN Stack**

**Last Updated**: January 2025

</div>
