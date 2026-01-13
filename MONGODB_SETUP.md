# MongoDB Setup Guide

## Problem: "Registration failed" error
This means MongoDB is not connected. You need to either:

## Option 1: Start Local MongoDB (if installed)

1. Open a new terminal
2. Run: `mongod`
3. Keep that terminal open
4. Restart the backend server

## Option 2: Use MongoDB Atlas (Cloud - FREE & RECOMMENDED)

### Steps:

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with your email (it's free)
3. **Create a free cluster** (M0 tier - no credit card needed)
4. **Create a database user**:
   - Username: `gigflow`
   - Password: `gigflow123` (or any password you want)
5. **Whitelist IP**: Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get connection string**: 
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://gigflow:<password>@cluster0.xxxxx.mongodb.net/`)

7. **Update your .env file**:
   ```
   MONGODB_URI=mongodb+srv://gigflow:gigflow123@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password
   Replace `cluster0.xxxxx` with your actual cluster URL

8. **Restart backend server**:
   - Press `Ctrl+C` in server terminal
   - Run: `npm run dev`
   - You should see: "MongoDB Connected: cluster0.xxxxx.mongodb.net"

## Verify Connection

✅ You should see in terminal: `MongoDB Connected: ...`  
❌ If you see nothing about MongoDB, the connection failed

## Test Registration Again

Once you see "MongoDB Connected", try registering a new user in the app.
