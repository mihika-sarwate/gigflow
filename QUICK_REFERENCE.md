# 🎯 GigFlow - Quick Reference Card

## 🚀 Quick Commands

### First Time Setup
```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
```

### Development
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Or use the batch file (Windows)
```bash
START.bat
```

## 🔗 URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017/gigflow

## 👥 Test Users (Create These)

| Role | Name | Email | Password |
|------|------|-------|----------|
| Client | Alice | alice@example.com | password123 |
| Freelancer | Bob | bob@example.com | password123 |
| Freelancer | Charlie | charlie@example.com | password123 |

## 📋 Testing Workflow

1. **Register** → Alice (client)
2. **Post Gig** → "Build React App" ($5000)
3. **Register** → Bob (freelancer)
4. **Submit Bid** → $4500 + cover letter
5. **Login** → Alice
6. **View Bids** → Hire Bob
7. **Check** → Bob gets real-time notification! 🎉

## 🎯 Key Features to Demo

✅ User authentication (JWT + HttpOnly cookies)
✅ Gig CRUD operations
✅ Search/filter gigs
✅ Bid submission
✅ **Atomic hiring** (MongoDB transactions)
✅ **Real-time notifications** (Socket.IO)
✅ Professional dark UI
✅ Mobile responsive

## 📁 Important Files

### Backend
- `server/server.js` - Entry point + Socket.IO
- `server/routes/bids.js` - **Hiring logic (line ~120)**
- `server/models/` - Database schemas
- `server/.env` - Configuration

### Frontend
- `client/src/App.jsx` - Routes + providers
- `client/src/store/` - Redux state
- `client/src/components/SocketProvider.jsx` - Real-time
- `client/src/pages/` - All page components

## 🔐 Environment Variables

### server/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=gigflow_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### client/.env
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🐛 Common Issues

**MongoDB not connecting?**
```bash
# Start MongoDB
mongod
```

**Port in use?**
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

**Dependencies issue?**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📊 API Quick Test

### Register
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com", 
  "password": "password123"
}
```

### Get Gigs
```bash
GET http://localhost:5000/api/gigs
```

## 🎨 UI Pages

| Route | Page | Description |
|-------|------|-------------|
| / | Home | Landing page |
| /login | Login | User login |
| /register | Register | New user signup |
| /dashboard | Dashboard | Browse gigs |
| /my-gigs | My Gigs | Posted gigs + bids |
| /my-bids | My Bids | Submitted bids |

## 🔔 Real-time Events

**Freelancer joins room:**
```javascript
socket.emit('join', userId);
```

**Hired notification:**
```javascript
socket.on('hired', (data) => {
  // Auto-triggered when hired
  // Shows toast + notification bell
});
```

## 📦 Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- Socket.IO Client
- React Router
- Axios
- React Hot Toast

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Socket.IO Server
- Express Validator
- Cookie Parser

## 🌟 Bonus Features

1. **MongoDB Transactions**
   - File: `server/routes/bids.js`
   - Function: `PATCH /api/bids/:bidId/hire`
   - Prevents race conditions

2. **Socket.IO Real-time**
   - Server: `server/server.js`
   - Client: `client/src/components/SocketProvider.jsx`
   - Instant hire notifications

## 📝 Documentation

- `README.md` - Main documentation
- `QUICKSTART.md` - Setup guide
- `API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT.md` - Production deployment
- `PROJECT_SUMMARY.md` - Assignment completion

## 🎬 Demo Video Tips

1. Show homepage (professional UI)
2. Create 2 users (client + freelancer)
3. Post a gig
4. Submit a bid
5. **Highlight: Hire freelancer**
6. **Show: Real-time notification** 🎉
7. Explain: MongoDB transactions
8. Show: Code structure

## 📞 Support

- Check browser console for errors
- Check server terminal for logs
- Verify MongoDB is running
- Ensure .env files exist
- Clear cookies if auth issues

## ✅ Pre-submission Checklist

- [ ] All features working locally
- [ ] MongoDB running
- [ ] No console errors
- [ ] Real-time notification works
- [ ] Atomic hiring works (test race condition)
- [ ] Code pushed to GitHub
- [ ] README updated
- [ ] Demo video recorded
- [ ] Deployed (optional but impressive)

---

**Everything is ready! Good luck! 🚀**
