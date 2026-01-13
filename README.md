# GigFlow - Freelance Marketplace Platform

![GigFlow](https://img.shields.io/badge/GigFlow-Freelance%20Marketplace-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)

A full-stack MERN application that enables clients to post jobs (gigs) and freelancers to bid on them. Features real-time notifications, secure authentication, and atomic hiring logic with race condition prevention.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication**: Secure sign-up and login with JWT tokens stored in HttpOnly cookies
- ✅ **Role Flexibility**: Any user can post jobs (as client) or bid on jobs (as freelancer)
- ✅ **Gig Management**: Full CRUD operations for job postings
- ✅ **Search & Filter**: Find gigs by title or description
- ✅ **Bidding System**: Freelancers can submit bids with custom pricing and cover letters
- ✅ **Hiring Workflow**: Clients review bids and hire freelancers

### Advanced Features (Bonuses)
- 🎯 **MongoDB Transactions**: Atomic operations prevent race conditions during hiring
- 🔔 **Real-time Notifications**: Socket.IO integration for instant hire notifications
- 🎨 **Professional Dark UI**: Modern, responsive design with Tailwind CSS

## 📋 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (custom dark theme)
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HttpOnly cookies
- **Validation**: Express Validator
- **Real-time**: Socket.IO Server
- **Security**: bcryptjs, cookie-parser, CORS

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

### Gig Model
```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  budget: Number (required, min 0),
  ownerId: ObjectId (ref: User),
  status: Enum ['open', 'assigned'],
  timestamps: true
}
```

### Bid Model
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String (required, max 500 chars),
  price: Number (required, min 0),
  status: Enum ['pending', 'hired', 'rejected'],
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Gigs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/gigs` | Get all open gigs (with search) | Public |
| GET | `/api/gigs/my-gigs` | Get user's posted gigs | Private |
| GET | `/api/gigs/:id` | Get single gig | Public |
| POST | `/api/gigs` | Create new gig | Private |
| PUT | `/api/gigs/:id` | Update gig (owner only) | Private |
| DELETE | `/api/gigs/:id` | Delete gig (owner only) | Private |

### Bids
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bids` | Submit a bid | Private |
| GET | `/api/bids/:gigId` | Get all bids for a gig | Private (Owner) |
| GET | `/api/bids/my-bids/list` | Get user's submitted bids | Private |
| PATCH | `/api/bids/:bidId/hire` | Hire a freelancer | Private (Owner) |

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **Password Hashing**: bcrypt with salt rounds
4. **Input Validation**: Express Validator on all inputs
5. **CORS Protection**: Configured for specific origins
6. **MongoDB Transactions**: Atomic operations for data integrity

## ⚡ Hiring Logic (Critical Feature)

The hiring process uses **MongoDB transactions** to ensure atomicity and prevent race conditions:

```javascript
// Atomic operations in a single transaction:
1. Update gig status to 'assigned'
2. Update selected bid status to 'hired'
3. Update all other bids to 'rejected'
4. Send real-time notification to hired freelancer
```

**Race Condition Prevention**: If two clients try to hire different freelancers simultaneously, only one transaction succeeds.

## 🔔 Real-time Notifications

Socket.IO implementation:
- Clients connect and join their personal room (user ID)
- When hired, freelancer receives instant notification
- Toast notification appears without page refresh
- Notification stored in Redux state

## 🎨 UI/UX Features

- **Dark Theme**: Professional color scheme with primary blue accents
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: User feedback for all actions
- **Modal Dialogs**: Clean forms for creating gigs and submitting bids
- **Status Badges**: Visual indicators for gig/bid status
- **Icons**: Lucide React for consistent iconography

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd full_stack_project
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file (use .env.example as template)
cp .env.example .env

# Edit .env with your values:
# - MongoDB connection string
# - JWT secret key
# - Port configuration
```

**server/.env** (example):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create .env file
cp .env.example .env
```

**client/.env** (example):
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🧪 Testing the Application

### 1. Create Users
1. Register as User A (Client)
2. Register as User B (Freelancer)
3. Register as User C (Freelancer)

### 2. Post a Gig (User A)
1. Login as User A
2. Navigate to "My Gigs"
3. Click "Post New Gig"
4. Fill in title, description, and budget
5. Submit

### 3. Submit Bids (Users B & C)
1. Login as User B
2. Go to "Browse Gigs"
3. Click "Submit Bid" on the gig
4. Enter your price and cover letter
5. Repeat for User C

### 4. Hire a Freelancer (User A)
1. Login as User A
2. Go to "My Gigs"
3. Click "View Bids" on your gig
4. Click "Hire This Freelancer" for one bid
5. **Check User B's dashboard** - they should see a real-time notification! 🎉

### 5. Verify Atomic Hiring
- User B's bid: status = "hired"
- User C's bid: status = "rejected"
- Gig status: "assigned"

## 📱 Application Screenshots

### Home Page
- Hero section with call-to-action
- Feature highlights
- Modern gradient design

### Dashboard (Browse Gigs)
- Search functionality
- Grid layout of available gigs
- Quick bid submission

### My Gigs
- View all posted gigs
- Create new gigs
- Review and manage bids
- Hire freelancers

### My Bids
- Track all submitted bids
- Status indicators (pending/hired/rejected)
- Summary statistics

## 🚧 Project Structure

```
full_stack_project/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── SocketProvider.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyGigs.jsx
│   │   │   ├── MyBids.jsx
│   │   │   └── GigDetails.jsx
│   │   ├── store/         # Redux store
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── gigSlice.js
│   │   │       ├── bidSlice.js
│   │   │       └── notificationSlice.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── server/                # Backend Express app
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── gigs.js
│   │   └── bids.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## 🎯 Key Implementation Highlights

### 1. MongoDB Transactions (Race Condition Prevention)
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // All database operations use session
  await Gig.findByIdAndUpdate(gigId, { status: 'assigned' }, { session });
  await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session });
  await Bid.updateMany({ gigId, _id: { $ne: bidId } }, { status: 'rejected' }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

### 2. Real-time Socket.IO Notifications
```javascript
// Server: Send notification when hired
io.to(freelancerId).emit('hired', { gigTitle, message });

// Client: Listen for notifications
socket.on('hired', (data) => {
  toast.success(data.message);
  dispatch(addNotification(data));
});
```

### 3. JWT HttpOnly Cookies
```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
```

## 🌐 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub

### Frontend (Vercel/Netlify)
1. Set build command: `npm run build`
2. Set output directory: `dist`
3. Add environment variables
4. Deploy

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.com
```

### Client (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check IP whitelist in MongoDB Atlas
- Verify network connectivity

### CORS Errors
- Ensure `CLIENT_URL` in backend .env matches frontend URL
- Check CORS configuration in server.js

### Socket.IO Not Working
- Verify Socket.IO versions match on client and server
- Check firewall settings
- Ensure `withCredentials: true` is set

### Cookie Issues
- Check browser allows cookies
- Verify `sameSite` and `secure` settings
- Use HTTPS in production

## 🤝 Contributing

This is an assignment project. For improvements or bug fixes, please create a pull request.

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👨‍💻 Author

Created as a Full Stack Development Internship Assignment

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack MERN architecture
- Redux Toolkit state management
- JWT authentication with HttpOnly cookies
- MongoDB transactions for data integrity
- Real-time communication with Socket.IO
- Modern React patterns (hooks, context)
- RESTful API design
- Responsive UI with Tailwind CSS
- Professional git workflow

## 📧 Support

For questions or issues, please create a GitHub issue.

---

**Built with ❤️ using the MERN stack**
