# 🚀 Deployment Guide

This guide covers deploying GigFlow to production using popular hosting platforms.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Alternative Platforms](#alternative-platforms)
5. [Post-Deployment Testing](#post-deployment-testing)

---

## Prerequisites
- GitHub account
- Code pushed to GitHub repository
- MongoDB Atlas account (free tier)
- Vercel account (free tier)
- Railway account (free tier) OR Render/Heroku

---

## MongoDB Atlas Setup

### 1. Create Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free account
- Create a new project (e.g., "GigFlow")

### 2. Create Cluster
- Click "Build a Database"
- Choose FREE tier (M0)
- Select cloud provider and region (closest to your users)
- Cluster name: "gigflow-cluster"
- Click "Create"

### 3. Configure Database Access
- Go to "Database Access" in left menu
- Click "Add New Database User"
- Username: `gigflow_admin`
- Password: Generate secure password (save it!)
- Database User Privileges: "Atlas admin"
- Click "Add User"

### 4. Configure Network Access
- Go to "Network Access" in left menu
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Go to "Database" in left menu
- Click "Connect" on your cluster
- Choose "Connect your application"
- Driver: Node.js, Version: 4.1 or later
- Copy the connection string:
```
mongodb+srv://gigflow_admin:<password>@gigflow-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
- Replace `<password>` with your actual password
- Add database name: `...mongodb.net/gigflow?retryWrites...`

**Final connection string:**
```
mongodb+srv://gigflow_admin:YOUR_PASSWORD@gigflow-cluster.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
```

---

## Backend Deployment (Railway)

### Why Railway?
- Free tier available
- Easy deployment from GitHub
- Supports environment variables
- Good for Node.js apps

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 2. Create New Project
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Authorize Railway to access your GitHub
- Select your GigFlow repository

### 3. Configure Service
- Railway will auto-detect Node.js
- Click on the service
- Go to "Settings" tab

### 4. Set Root Directory
- In Settings, find "Root Directory"
- Set to: `server`
- This tells Railway to deploy only the backend

### 5. Add Environment Variables
- Go to "Variables" tab
- Add each variable:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://gigflow_admin:YOUR_PASSWORD@gigflow-cluster.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_production_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
CLIENT_URL=https://your-app-name.vercel.app
```

**Important:** 
- Use your actual MongoDB connection string
- Generate a strong JWT secret (32+ characters)
- `CLIENT_URL` will be your Vercel URL (update after frontend deployment)

### 6. Deploy
- Click "Deploy"
- Wait for build to complete
- Once deployed, you'll get a URL like: `https://your-app.railway.app`

### 7. Update CLIENT_URL
- After deploying frontend (next section), come back here
- Update `CLIENT_URL` to your Vercel URL
- Railway will auto-redeploy

---

## Frontend Deployment (Vercel)

### Why Vercel?
- Built for React/Next.js apps
- Free tier with great performance
- Auto-deploys on git push
- Instant global CDN

### 1. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### 2. Import Project
- Click "Add New" → "Project"
- Import your GitHub repository
- Vercel will auto-detect Vite

### 3. Configure Build Settings
- Framework Preset: Vite
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

### 4. Add Environment Variables
- In "Environment Variables" section, add:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

**Replace** `your-backend.railway.app` with your actual Railway URL.

### 5. Deploy
- Click "Deploy"
- Wait for build (2-3 minutes)
- You'll get a URL like: `https://gigflow-app.vercel.app`

### 6. Update Backend CORS
- Go back to Railway
- Update `CLIENT_URL` environment variable
- Set to your Vercel URL: `https://gigflow-app.vercel.app`

---

## Alternative Platforms

### Backend Alternatives

#### Option A: Render
1. Create account at https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables (same as Railway)

#### Option B: Heroku
1. Install Heroku CLI
2. `heroku login`
3. `heroku create gigflow-api`
4. Set buildpacks: `heroku buildpacks:set heroku/nodejs`
5. Set root: Add `heroku-postbuild` script in server/package.json
6. `git subtree push --prefix server heroku main`

### Frontend Alternatives

#### Option A: Netlify
1. Create account at https://netlify.com
2. New site from Git
3. Build command: `npm run build`
4. Publish directory: `client/dist`
5. Add environment variables

#### Option B: GitHub Pages (Static)
- Not recommended for this app (needs env variables support)

---

## Post-Deployment Testing

### 1. Test Backend API
Open your Railway URL in browser:
```
https://your-backend.railway.app/api/gigs
```
Should return: `{"success":true,"count":0,"gigs":[]}`

### 2. Test Frontend
- Visit your Vercel URL
- Open browser DevTools → Console
- Should see: "Connected to Socket.IO"
- No CORS errors

### 3. Full User Flow Test
1. Register a new user
2. Create a gig
3. Login with different user
4. Submit a bid
5. Hire the freelancer
6. **Verify real-time notification works!**

### 4. Check MongoDB
- Go to MongoDB Atlas
- Clusters → Browse Collections
- Should see: users, gigs, bids collections

---

## Common Deployment Issues

### Issue: CORS Error
**Symptoms:** Browser console shows CORS policy error

**Solution:**
- Verify `CLIENT_URL` in backend matches frontend URL exactly
- No trailing slash in URLs
- Redeploy backend after changing

### Issue: 500 Error on API Calls
**Symptoms:** All API calls return 500

**Solution:**
- Check Railway logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Issue: Socket.IO Not Connecting
**Symptoms:** No real-time notifications

**Solution:**
- Verify `VITE_SOCKET_URL` matches backend URL
- Check Railway supports WebSocket (it does)
- Look for firewall/proxy issues

### Issue: "Cannot read property of undefined"
**Symptoms:** Frontend crashes on certain pages

**Solution:**
- Check browser console for specific error
- Verify API responses match expected format
- Clear browser cache and cookies

### Issue: MongoDB Connection Timeout
**Symptoms:** "MongoNetworkError: connection timed out"

**Solution:**
- MongoDB Atlas → Network Access
- Ensure 0.0.0.0/0 is whitelisted
- Check connection string is correct
- Verify password doesn't have special characters (URL encode if needed)

---

## Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gigflow
JWT_SECRET=minimum_32_character_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## Performance Optimization

### Backend
1. Enable compression in Express:
```javascript
import compression from 'compression';
app.use(compression());
```

2. Add MongoDB indexes (already done in models)

3. Enable caching headers

### Frontend
1. Already optimized with Vite
2. Code splitting automatic
3. Assets minified in production build

---

## Monitoring & Maintenance

### Railway
- View logs: Dashboard → Your service → Logs
- Monitor usage: Dashboard → Your service → Metrics
- Set up notifications for errors

### Vercel
- View deployment logs: Project → Deployments → Click deployment
- Check analytics: Project → Analytics
- Monitor bandwidth usage

### MongoDB Atlas
- View database metrics: Database → Metrics
- Set up alerts: Alerts → Create Alert
- Monitor connection counts

---

## Security Best Practices

✅ **Implemented:**
- JWT tokens in HttpOnly cookies
- Password hashing with bcrypt
- CORS configured
- Input validation on all endpoints
- MongoDB transactions for atomicity

🔒 **Additional Recommendations:**
1. Add rate limiting (express-rate-limit)
2. Use Helmet.js for security headers
3. Enable MongoDB encryption at rest
4. Set up SSL/TLS certificates (automatic with Railway/Vercel)
5. Implement request sanitization
6. Add logging (Winston, Morgan)
7. Set up error monitoring (Sentry)

---

## Scaling Considerations

### If your app grows:

1. **Database:**
   - Upgrade MongoDB Atlas tier
   - Add database replicas
   - Implement caching (Redis)

2. **Backend:**
   - Horizontal scaling (multiple instances)
   - Load balancing
   - CDN for static assets

3. **Real-time:**
   - Socket.IO Redis adapter for multi-instance support
   - Separate Socket.IO server

---

## Custom Domain (Optional)

### Backend
1. Railway: Settings → Domains → Add custom domain
2. Add DNS records as instructed
3. SSL automatically provisioned

### Frontend
1. Vercel: Settings → Domains → Add
2. Update DNS records
3. SSL automatically provisioned

---

## Rollback Strategy

### Railway
- Deployments → Click previous deployment → "Redeploy"

### Vercel
- Deployments → Find working deployment → "Promote to Production"

---

## Cost Estimates

### Free Tier Limits
- **MongoDB Atlas:** 512 MB storage, Shared RAM
- **Railway:** $5 free credit/month, ~500 hours
- **Vercel:** 100 GB bandwidth, Unlimited deployments

### When to Upgrade
- MongoDB: >512 MB data
- Railway: >500 hours runtime/month
- Vercel: >100 GB bandwidth/month

**Estimated cost for small app:** $0-15/month

---

## Final Checklist

Before submitting:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas configured
- [ ] Environment variables set correctly
- [ ] CORS working (no browser errors)
- [ ] Authentication working (login/register)
- [ ] Gigs CRUD working
- [ ] Bidding system working
- [ ] Hiring logic working (with transaction)
- [ ] Real-time notifications working
- [ ] No console errors
- [ ] README updated with live links
- [ ] Demo video recorded

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Socket.IO Deployment: https://socket.io/docs/v4/

---

**Congratulations! Your app is now live! 🎉**

Share your deployed links:
- Frontend: https://your-app.vercel.app
- Backend: https://your-api.railway.app
