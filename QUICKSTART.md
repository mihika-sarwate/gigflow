# 🚀 Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed (v16+)
- ✅ MongoDB installed (local) OR MongoDB Atlas account
- ✅ Git installed

## Step-by-Step Setup

### 1️⃣ Install Dependencies
Dependencies are already installed! If you need to reinstall:

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2️⃣ Start MongoDB
Choose one option:

**Option A: Local MongoDB**
```bash
# Windows
mongod

# macOS/Linux
sudo mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `server/.env` with your connection string

### 3️⃣ Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
✅ Server should start on http://localhost:5000

**Terminal 2 - Frontend App:**
```bash
cd client
npm run dev
```
✅ Frontend should start on http://localhost:5173

### 4️⃣ Open Your Browser
Navigate to: **http://localhost:5173**

## 📝 Testing the Full Workflow

### A. Create Two User Accounts

**User 1 (Client):**
1. Click "Register"
2. Name: Alice Johnson
3. Email: alice@example.com
4. Password: password123
5. Click "Create Account"

**User 2 (Freelancer):**
1. Logout (if logged in as Alice)
2. Click "Register"
3. Name: Bob Smith
4. Email: bob@example.com
5. Password: password123
6. Click "Create Account"

### B. Post a Gig (as Alice)

1. Login as alice@example.com
2. Click "My Gigs" in navbar
3. Click "Post New Gig"
4. Fill in:
   - Title: "Build a React E-commerce Website"
   - Description: "Need a full-featured e-commerce site with cart, checkout, and payment integration"
   - Budget: 5000
5. Click "Post Gig"

### C. Submit a Bid (as Bob)

1. Logout and login as bob@example.com
2. Click "Browse Gigs"
3. You should see Alice's gig
4. Click "Submit Bid"
5. Fill in:
   - Bid Amount: 4500
   - Cover Letter: "I have 5 years of React experience and can deliver this in 3 weeks..."
6. Click "Submit Bid"

### D. Hire the Freelancer (as Alice)

1. Logout and login as alice@example.com
2. Click "My Gigs"
3. Click "View Bids" on your gig
4. You should see Bob's bid
5. Click "Hire This Freelancer"
6. ✅ Confirm the hire

### E. Check Real-time Notification (as Bob)

1. **Keep Bob logged in on another browser/incognito window**
2. When Alice hires Bob, Bob should see:
   - 🎉 Instant toast notification: "You have been hired for..."
   - Bell icon shows notification count
   - No page refresh needed!

3. Bob can also check:
   - Click "My Bids" to see status changed to "Hired ✨"

### F. Verify Atomic Operations

1. All of Bob's bid status = "hired"
2. Any other bids (if you create more users) = "rejected"
3. Gig status changed from "open" to "assigned"

## 🎨 UI Features to Explore

### Dark Theme
- Professional dark color scheme
- Primary blue accents (#0ea5e9)
- Smooth transitions and hover effects

### Responsive Design
- Resize browser to see mobile layout
- Hamburger menu on small screens
- Cards adapt to screen size

### Interactive Elements
- Loading spinners during API calls
- Toast notifications for all actions
- Modal dialogs for forms
- Status badges with colors

### Search Functionality
1. Go to "Browse Gigs"
2. Type keywords in search bar
3. Results filter in real-time

## 🧪 Testing Race Conditions

To test the atomic hiring logic:

1. Create 1 gig (as User A)
2. Create 2 bids from different users (User B, User C)
3. Open "View Bids" in two browser tabs
4. Try to hire both freelancers simultaneously
5. ✅ Only ONE should succeed
6. The other should show error: "This gig has already been assigned"

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB server first

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using that port or change PORT in .env

### CORS Errors in Browser Console
**Solution:** Ensure both servers are running and .env URLs match

### Socket.IO Not Connecting
**Solution:** 
- Check both servers are running
- Verify VITE_SOCKET_URL in client/.env
- Check browser console for errors

### Cookies Not Being Set
**Solution:**
- Clear browser cookies
- Ensure you're on http://localhost (not 127.0.0.1)
- Check browser allows cookies

## 📊 API Testing with Postman/Thunder Client

### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Create Gig (requires auth cookie)
```http
POST http://localhost:5000/api/gigs
Content-Type: application/json

{
  "title": "Sample Gig",
  "description": "Test description",
  "budget": 1000
}
```

## 🎯 What Makes This Project Stand Out

✅ **MongoDB Transactions** - Prevents race conditions during hiring
✅ **Real-time Notifications** - Socket.IO for instant updates
✅ **Professional UI** - Dark theme, responsive, polished
✅ **Complete CRUD** - All operations implemented
✅ **Secure Authentication** - JWT with HttpOnly cookies
✅ **Redux Toolkit** - Modern state management
✅ **Input Validation** - Server-side validation on all endpoints
✅ **Error Handling** - Comprehensive error messages
✅ **Loading States** - User feedback during async operations

## 📹 Creating Demo Video (2 minutes)

### Suggested Script:

**[0:00-0:15] Introduction**
- "Hi, I'm demonstrating GigFlow, a freelance marketplace platform"
- Show homepage and explain concept

**[0:15-0:45] User Registration & Gig Posting**
- Register as client
- Navigate to "My Gigs"
- Create a new gig with details

**[0:45-1:15] Bidding Process**
- Switch to freelancer account
- Browse gigs
- Submit a bid with custom price

**[1:15-1:45] Hiring & Real-time Notification**
- Switch back to client
- View bids
- Click "Hire This Freelancer"
- **Show real-time notification** on freelancer's screen

**[1:45-2:00] Verification**
- Show bid status changed to "hired"
- Show gig status changed to "assigned"
- Mention MongoDB transactions prevent race conditions

## 🚀 Next Steps

1. ✅ Test all features locally
2. ✅ Record demo video
3. ✅ Push to GitHub
4. Deploy to:
   - Backend: Railway, Render, or Heroku
   - Frontend: Vercel or Netlify
5. Update README with live links
6. Submit assignment!

## 💡 Tips for Success

- Test the real-time notification feature - it's impressive!
- Mention the MongoDB transaction implementation in your video
- Highlight the professional UI design
- Explain the atomic hiring logic
- Show the responsive design

---

**You're all set! Good luck with your assignment! 🎉**
