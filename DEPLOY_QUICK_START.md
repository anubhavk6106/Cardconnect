# 🚀 Quick Deployment Guide - Render

## Step-by-Step Instructions

### 1️⃣ Push Code to GitHub
```bash
git add .
git commit -m "Add deployment configuration for Render"
git push origin main
```

### 2️⃣ Deploy Backend

1. Go to https://render.com → Sign up/Login
2. Click **"New +" → "Web Service"**
3. Connect GitHub → Select **CardConnect** repository
4. Configure:
   - **Name:** `cardconnect-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Add Environment Variables (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=generate_random_32_char_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://cardconnect-backend.onrender.com`)

### 3️⃣ Deploy Frontend

1. In Render dashboard, click **"New +" → "Static Site"**
2. Select **CardConnect** repository
3. Configure:
   - **Name:** `cardconnect-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://cardconnect-backend.onrender.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

5. Click **"Create Static Site"**
6. Wait 5-10 minutes for deployment
7. Copy your frontend URL (e.g., `https://cardconnect-frontend.onrender.com`)

### 4️⃣ Update Backend with Frontend URL

1. Go to backend service in Render
2. Settings → Environment
3. Update `FRONTEND_URL` to your actual frontend URL
4. Save → Service will auto-redeploy

### 5️⃣ Configure MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allow all)
4. Save

### 6️⃣ Create Admin User

1. Go to backend service in Render
2. Click "Shell" tab
3. Run: `node scripts/createAdmin.js`
4. Login with: `admin@cardconnect.com` / `admin123`
5. **Change password immediately!**

## ✅ Test Your Deployment

- [ ] Visit frontend URL - site loads
- [ ] Register a new user
- [ ] Login works
- [ ] Upload an image (test Cloudinary)
- [ ] Create a card (for card owners)
- [ ] Test payment (Razorpay test mode)
- [ ] Check chat/notifications (Socket.io)

## 🎉 Done!

Your app is now live on Render!

**Need detailed help?** See `DEPLOYMENT.md` for complete documentation.

---

## 📝 Important Notes

- **Free Tier:** Services spin down after 15 min inactivity
- **First Request:** May take 30-60 seconds to wake up
- **Auto-Deploy:** Pushes to GitHub auto-deploy
- **Logs:** Check Render dashboard for errors
