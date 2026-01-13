# 🧪 GigFlow - Testing Guide

## Complete Testing Checklist

This guide ensures every feature works correctly before submission.

---

## Prerequisites
- [ ] MongoDB is running (`mongod`)
- [ ] Backend server is running (`cd server && npm run dev`)
- [ ] Frontend server is running (`cd client && npm run dev`)
- [ ] No console errors in terminal
- [ ] Browser at http://localhost:5173

---

## Test 1: Authentication System

### 1.1 Registration
- [ ] Click "Register" button
- [ ] Fill form:
  - Name: Alice Johnson
  - Email: alice@example.com
  - Password: password123
  - Confirm: password123
- [ ] Click "Create Account"
- [ ] **Expected:** Redirected to dashboard
- [ ] **Expected:** Toast notification "Registration successful!"
- [ ] **Expected:** Navbar shows "Alice Johnson"

### 1.2 Logout
- [ ] Click "Logout" button
- [ ] **Expected:** Redirected to home page
- [ ] **Expected:** Toast "Logged out successfully"
- [ ] **Expected:** Navbar shows "Login" and "Register"

### 1.3 Login
- [ ] Click "Login" button
- [ ] Enter credentials:
  - Email: alice@example.com
  - Password: password123
- [ ] Click "Sign In"
- [ ] **Expected:** Redirected to dashboard
- [ ] **Expected:** Toast "Login successful!"
- [ ] **Expected:** Navbar shows user name

### 1.4 Protected Routes
- [ ] Logout
- [ ] Try to access http://localhost:5173/dashboard directly
- [ ] **Expected:** Redirected to login page

### 1.5 Invalid Credentials
- [ ] Try login with wrong password
- [ ] **Expected:** Error message "Invalid credentials"
- [ ] Try registering with existing email
- [ ] **Expected:** Error "User already exists"

**✅ Authentication Test Complete**

---

## Test 2: Gig Management (CRUD)

### 2.1 Create Gig
- [ ] Login as alice@example.com
- [ ] Navigate to "My Gigs"
- [ ] Click "Post New Gig"
- [ ] Fill form:
  - Title: "Build a Modern E-commerce Website"
  - Description: "Need a full-featured online store with shopping cart, checkout, payment integration, and admin dashboard. Must be responsive and SEO-friendly."
  - Budget: 5000
- [ ] Click "Post Gig"
- [ ] **Expected:** Modal closes
- [ ] **Expected:** Toast "Gig created successfully!"
- [ ] **Expected:** Gig appears in My Gigs list
- [ ] **Expected:** Status badge shows "Open"

### 2.2 View Gig Details
- [ ] Check gig card shows:
  - [ ] Title
  - [ ] Description
  - [ ] Budget ($5000)
  - [ ] Status (Open)
  - [ ] Posted date
  - [ ] "View Bids" button
  - [ ] Delete button (trash icon)

### 2.3 Create More Gigs
- [ ] Create 2 more gigs with different details
- [ ] **Expected:** All 3 gigs visible in "My Gigs"

### 2.4 Browse Gigs (Public View)
- [ ] Navigate to "Browse Gigs" (Dashboard)
- [ ] **Expected:** See all 3 gigs
- [ ] **Expected:** Each shows "Your Gig" badge (since you're the owner)
- [ ] **Expected:** No "Submit Bid" button on your own gigs

### 2.5 Delete Gig
- [ ] In "My Gigs", click delete (trash) on one gig
- [ ] Confirm deletion
- [ ] **Expected:** Gig removed from list
- [ ] **Expected:** Toast "Gig deleted successfully"

**✅ Gig Management Test Complete**

---

## Test 3: Search & Filter

### 3.1 Search by Title
- [ ] Go to "Browse Gigs" (Dashboard)
- [ ] In search box, type: "e-commerce"
- [ ] Click "Search"
- [ ] **Expected:** Only matching gigs appear
- [ ] **Expected:** Non-matching gigs hidden

### 3.2 Search by Description
- [ ] Search for: "responsive"
- [ ] **Expected:** Gigs with "responsive" in description appear

### 3.3 Clear Search
- [ ] Clear search box
- [ ] Click "Search"
- [ ] **Expected:** All gigs shown again

### 3.4 No Results
- [ ] Search for: "xxxxxxxxxx"
- [ ] **Expected:** "No gigs available at the moment" message

**✅ Search Test Complete**

---

## Test 4: Bidding System

### 4.1 Create Freelancer Account
- [ ] Logout
- [ ] Register new user:
  - Name: Bob Smith
  - Email: bob@example.com
  - Password: password123
- [ ] **Expected:** Redirected to dashboard

### 4.2 View Available Gigs
- [ ] In Dashboard, see Alice's gigs
- [ ] **Expected:** "Submit Bid" button visible
- [ ] **Expected:** No "Your Gig" badge

### 4.3 Submit Bid
- [ ] Click "Submit Bid" on "Build E-commerce Website"
- [ ] Fill modal:
  - Bid Amount: 4500
  - Cover Letter: "I have 5 years of React and Node.js experience. I've built similar e-commerce platforms for clients like XYZ Corp. I can deliver this in 3 weeks with daily progress updates. My portfolio includes..."
- [ ] Click "Submit Bid"
- [ ] **Expected:** Modal closes
- [ ] **Expected:** Toast "Bid submitted successfully!"

### 4.4 Prevent Duplicate Bids
- [ ] Try to submit another bid on same gig
- [ ] **Expected:** Error "You have already submitted a bid for this gig"

### 4.5 Create More Freelancers & Bids
- [ ] Logout and create User C:
  - Name: Charlie Davis
  - Email: charlie@example.com
  - Password: password123
- [ ] Submit bid: $4800 with different cover letter
- [ ] Create User D (optional): dave@example.com
- [ ] Submit bid: $4200

### 4.6 View My Bids
- [ ] As Bob, go to "My Bids"
- [ ] **Expected:** See submitted bid
- [ ] **Expected:** Status badge "Pending"
- [ ] **Expected:** Shows gig details
- [ ] **Expected:** Shows your bid amount
- [ ] **Expected:** Shows your cover letter

**✅ Bidding Test Complete**

---

## Test 5: Hiring Logic (Critical!)

### 5.1 Setup for Real-time Test
**Important:** Keep two browser windows open
- [ ] Window 1: Login as alice@example.com (Client)
- [ ] Window 2: Login as bob@example.com (Freelancer)
- [ ] Window 2: Navigate to "My Bids" and keep visible

### 5.2 View Bids (as Client)
- [ ] In Window 1 (Alice), go to "My Gigs"
- [ ] Click "View Bids" on the gig with bids
- [ ] **Expected:** Modal shows all bids
- [ ] **Expected:** See Bob's bid ($4500)
- [ ] **Expected:** See Charlie's bid ($4800)
- [ ] **Expected:** Each shows:
  - [ ] Freelancer name and email
  - [ ] Bid amount
  - [ ] Cover letter
  - [ ] Status badge "Pending"
  - [ ] "Hire This Freelancer" button
  - [ ] Submission date/time

### 5.3 Hire Freelancer + Real-time Notification
- [ ] In Window 1 (Alice), click "Hire This Freelancer" for Bob
- [ ] Confirm when prompted
- [ ] **Watch Window 2 (Bob) - Should happen WITHOUT refreshing:**
  - [ ] 🎉 Toast notification appears: "Congratulations! You have been hired for..."
  - [ ] Bell icon shows notification count (1)
  - [ ] Bid status changes to "Hired ✨"
- [ ] **In Window 1 (Alice):**
  - [ ] Toast "Freelancer hired successfully!"
  - [ ] Bob's bid shows "Hired" badge (green)
  - [ ] Charlie's bid shows "Rejected" badge (red)

### 5.4 Verify Database Changes
- [ ] Refresh "My Gigs" (Alice)
- [ ] **Expected:** Gig status changed to "Assigned" (blue badge)
- [ ] Click "View Bids" again
- [ ] **Expected:** 
  - Bob's bid: status = "hired"
  - Charlie's bid: status = "rejected"
  - No "Hire" buttons (gig closed)

### 5.5 Verify Freelancer View
- [ ] In Window 2 (Bob), go to "My Bids"
- [ ] **Expected:** 
  - [ ] Bid card highlighted (green border)
  - [ ] Status "Hired ✨"
  - [ ] "🎉 Congratulations!" message
  - [ ] "You've been hired for this project"
  - [ ] Gig status shows "Assigned"

### 5.6 Verify Rejected Freelancer
- [ ] Login as charlie@example.com
- [ ] Go to "My Bids"
- [ ] **Expected:**
  - [ ] Status "Not Selected" (red)
  - [ ] No congratulations message

### 5.7 Verify Gig is Closed
- [ ] Login as any user
- [ ] Go to "Browse Gigs"
- [ ] **Expected:** The hired gig NO LONGER appears (only open gigs shown)

**✅ Hiring Logic Test Complete**

---

## Test 6: Race Condition Prevention

### 6.1 Setup
- [ ] Create a new gig (as Alice)
- [ ] Create 2 bids from Bob and Charlie

### 6.2 Simulate Simultaneous Hiring
- [ ] Open "View Bids" in TWO browser tabs (both as Alice)
- [ ] Tab 1: Prepare to hire Bob (hover over button)
- [ ] Tab 2: Prepare to hire Charlie (hover over button)
- [ ] Click BOTH "Hire" buttons at the same time
- [ ] **Expected:**
  - [ ] Only ONE hire succeeds
  - [ ] Other tab shows error: "This gig has already been assigned"
  - [ ] No duplicate hires
  - [ ] Database integrity maintained

### 6.3 Verify Transaction
- [ ] Check "My Gigs"
- [ ] **Expected:** 
  - [ ] Gig status = "assigned" (only once)
  - [ ] Only ONE bid with "hired" status
  - [ ] All other bids "rejected"

**✅ Race Condition Test Complete**

---

## Test 7: UI/UX & Responsiveness

### 7.1 Desktop View
- [ ] Full screen browser
- [ ] **Check:**
  - [ ] Navigation bar looks professional
  - [ ] Cards in grid layout (3 columns)
  - [ ] No text overflow
  - [ ] All buttons accessible
  - [ ] Hover effects work

### 7.2 Tablet View
- [ ] Resize browser to ~768px width
- [ ] **Check:**
  - [ ] Grid becomes 2 columns
  - [ ] Navigation still works
  - [ ] Forms are usable

### 7.3 Mobile View
- [ ] Resize browser to ~375px width (phone size)
- [ ] **Check:**
  - [ ] Hamburger menu appears
  - [ ] Single column grid
  - [ ] Text remains readable
  - [ ] Buttons are touch-friendly
  - [ ] Modals are scrollable

### 7.4 Dark Theme
- [ ] **Verify colors:**
  - [ ] Background: Very dark blue (#0F172A)
  - [ ] Cards: Lighter dark (#1E293B)
  - [ ] Primary: Blue (#0ea5e9)
  - [ ] Text: Light gray/white
  - [ ] Good contrast (readable)

### 7.5 Loading States
- [ ] Watch for loading spinners during:
  - [ ] Login
  - [ ] Fetching gigs
  - [ ] Submitting bid
  - [ ] Hiring freelancer

### 7.6 Notifications
- [ ] Check toast notifications appear for:
  - [ ] Success actions (green)
  - [ ] Error actions (red)
  - [ ] Proper messages
  - [ ] Auto-dismiss after 4 seconds

**✅ UI/UX Test Complete**

---

## Test 8: Edge Cases

### 8.1 Empty States
- [ ] Login as new user with no activity
- [ ] Go to "My Gigs"
- [ ] **Expected:** "You haven't posted any gigs yet" message
- [ ] Go to "My Bids"
- [ ] **Expected:** "You haven't submitted any bids yet" message

### 8.2 Form Validation
- [ ] Try submitting forms with:
  - [ ] Empty fields → Error messages
  - [ ] Invalid email → Error
  - [ ] Short password (<6 chars) → Error
  - [ ] Negative budget → Error
  - [ ] Negative bid → Error

### 8.3 Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] **Expected:** Error message (connection refused)
- [ ] Restart server
- [ ] **Expected:** Everything works again

### 8.4 Session Persistence
- [ ] Login
- [ ] Refresh page
- [ ] **Expected:** Still logged in
- [ ] Close browser
- [ ] Reopen and go to site
- [ ] **Expected:** Still logged in (cookie persists)

**✅ Edge Cases Test Complete**

---

## Test 9: Browser Console Check

### 9.1 No Errors
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] **Expected:** No red error messages
- [ ] **Expected:** See "Connected to Socket.IO"
- [ ] **Expected:** No CORS errors

### 9.2 Network Tab
- [ ] Go to Network tab
- [ ] Perform actions (login, create gig, etc.)
- [ ] **Check:**
  - [ ] API calls return 200/201
  - [ ] No 500 errors
  - [ ] Cookies are set
  - [ ] WebSocket connection active

**✅ Console Check Complete**

---

## Test 10: Final Integration Test

### Complete User Journey
- [ ] **Act 1: Client Posts Job**
  1. Register as "Sarah Client" (sarah@example.com)
  2. Post gig: "Mobile App Development" - $10,000
  3. Post gig: "Logo Design" - $500

- [ ] **Act 2: Freelancers Respond**
  1. Register as "Mike Dev" (mike@example.com)
  2. Bid on "Mobile App" - $9000
  3. Register as "Lisa Designer" (lisa@example.com)
  4. Bid on both gigs ($8500 and $450)

- [ ] **Act 3: Hiring & Notifications**
  1. Login as Sarah
  2. View bids on "Mobile App"
  3. Hire Mike
  4. **Verify Mike gets real-time notification**
  5. View bids on "Logo Design"
  6. Hire Lisa
  7. **Verify Lisa gets real-time notification**

- [ ] **Act 4: Verify All Changes**
  1. Sarah's "My Gigs" → Both show "Assigned"
  2. Mike's "My Bids" → "Hired" on Mobile App
  3. Lisa's "My Bids" → "Hired" on Logo, "Rejected" on Mobile App
  4. Dashboard → No open gigs (all assigned)

**✅ Integration Test Complete**

---

## Test Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Authentication | ⬜ | Login, Register, Logout |
| Gig CRUD | ⬜ | Create, Read, Update, Delete |
| Search | ⬜ | Title & description search |
| Bidding | ⬜ | Submit, view, track bids |
| Hiring | ⬜ | Atomic operation |
| Real-time | ⬜ | Socket.IO notifications |
| Race Conditions | ⬜ | Transaction safety |
| UI/UX | ⬜ | Responsive, professional |
| Edge Cases | ⬜ | Validation, errors |
| Performance | ⬜ | Loading states, speed |

**Overall Status:** ⬜ PASS / ⬜ FAIL

---

## Known Issues to Document

_List any bugs or limitations found:_

1. 
2. 
3. 

---

## Pre-Submission Checklist

- [ ] All tests passed
- [ ] No console errors
- [ ] Real-time notifications work
- [ ] Race condition prevented
- [ ] Code committed to Git
- [ ] .env files not committed (.gitignore working)
- [ ] README.md updated
- [ ] Demo video recorded
- [ ] Deployment completed (optional)

---

## Demo Video Script (Based on Tests)

**[0:00-0:15]**
- Show homepage
- "This is GigFlow, a freelance marketplace"

**[0:15-0:45]**
- Register as client
- Post a gig
- Show professional UI

**[0:45-1:15]**
- Register as freelancer
- Browse gigs
- Submit a bid with cover letter

**[1:15-1:45]**
- Login as client
- View bids
- **Hire freelancer**
- **Show instant notification on freelancer screen** 🎉

**[1:45-2:00]**
- Show code: MongoDB transaction
- Mention: Race condition prevention
- Thank you!

---

**Testing Complete! Ready for Submission! 🎉**
