# GigFlow API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a valid JWT token in an HttpOnly cookie. The token is automatically set upon successful login/registration.

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: User already exists / Validation errors

---

### Login User
**POST** `/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### Logout User
**POST** `/auth/logout`

🔒 **Requires Authentication**

Clear the authentication cookie.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/auth/me`

🔒 **Requires Authentication**

Get the currently authenticated user's information.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: Not authenticated

---

## Gig Endpoints

### Get All Open Gigs
**GET** `/gigs?search=keyword`

Get all gigs with status "open". Supports optional search parameter.

**Query Parameters:**
- `search` (optional): Search by title or description

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "gigs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Build a React Website",
      "description": "Need a modern React website with...",
      "budget": 5000,
      "status": "open",
      "ownerId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-13T10:30:00.000Z",
      "updatedAt": "2024-01-13T10:30:00.000Z"
    }
  ]
}
```

---

### Get My Gigs
**GET** `/gigs/my-gigs`

🔒 **Requires Authentication**

Get all gigs posted by the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "gigs": [...]
}
```

---

### Get Single Gig
**GET** `/gigs/:id`

Get a specific gig by ID.

**Response (200):**
```json
{
  "success": true,
  "gig": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Build a React Website",
    ...
  }
}
```

**Errors:**
- 404: Gig not found

---

### Create Gig
**POST** `/gigs`

🔒 **Requires Authentication**

Create a new job posting.

**Request Body:**
```json
{
  "title": "Build a React Website",
  "description": "I need a modern React website with authentication, dashboard, and payment integration.",
  "budget": 5000
}
```

**Response (201):**
```json
{
  "success": true,
  "gig": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Build a React Website",
    "description": "I need a modern React website...",
    "budget": 5000,
    "status": "open",
    "ownerId": {...},
    "createdAt": "2024-01-13T10:30:00.000Z"
  }
}
```

**Errors:**
- 400: Validation errors

---

### Update Gig
**PUT** `/gigs/:id`

🔒 **Requires Authentication** (Owner only)

Update an existing gig.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "budget": 6000
}
```

**Response (200):**
```json
{
  "success": true,
  "gig": {...}
}
```

**Errors:**
- 403: Not authorized (not the owner)
- 404: Gig not found

---

### Delete Gig
**DELETE** `/gigs/:id`

🔒 **Requires Authentication** (Owner only)

Delete a gig posting.

**Response (200):**
```json
{
  "success": true,
  "message": "Gig removed"
}
```

**Errors:**
- 403: Not authorized
- 404: Gig not found

---

## Bid Endpoints

### Submit Bid
**POST** `/bids`

🔒 **Requires Authentication**

Submit a bid for a gig.

**Request Body:**
```json
{
  "gigId": "507f1f77bcf86cd799439012",
  "message": "I have 5 years of React experience and can deliver this project in 3 weeks. My portfolio includes...",
  "price": 4500
}
```

**Response (201):**
```json
{
  "success": true,
  "bid": {
    "_id": "507f1f77bcf86cd799439013",
    "gigId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Build a React Website",
      ...
    },
    "freelancerId": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "message": "I have 5 years of React experience...",
    "price": 4500,
    "status": "pending",
    "createdAt": "2024-01-13T11:00:00.000Z"
  }
}
```

**Errors:**
- 400: Gig is closed / Already submitted a bid / Cannot bid on own gig
- 404: Gig not found

---

### Get Bids for a Gig
**GET** `/bids/:gigId`

🔒 **Requires Authentication** (Gig owner only)

Get all bids submitted for a specific gig.

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "bids": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "freelancerId": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "message": "I have 5 years of React experience...",
      "price": 4500,
      "status": "pending",
      "createdAt": "2024-01-13T11:00:00.000Z"
    }
  ]
}
```

**Errors:**
- 403: Not authorized (not the gig owner)
- 404: Gig not found

---

### Get My Bids
**GET** `/bids/my-bids/list`

🔒 **Requires Authentication**

Get all bids submitted by the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "bids": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "gigId": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Build a React Website",
        "description": "...",
        "budget": 5000,
        "status": "assigned"
      },
      "message": "I have 5 years of React experience...",
      "price": 4500,
      "status": "hired",
      "createdAt": "2024-01-13T11:00:00.000Z"
    }
  ]
}
```

---

### Hire Freelancer
**PATCH** `/bids/:bidId/hire`

🔒 **Requires Authentication** (Gig owner only)

⚡ **Uses MongoDB Transactions** for atomic operations

Hire a freelancer for a gig. This operation:
1. Changes gig status to "assigned"
2. Changes selected bid status to "hired"
3. Changes all other bids to "rejected"
4. Sends real-time notification via Socket.IO

**Response (200):**
```json
{
  "success": true,
  "message": "Freelancer hired successfully",
  "bid": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "hired",
    "freelancerId": {...},
    "gigId": {
      "_id": "507f1f77bcf86cd799439012",
      "status": "assigned",
      ...
    }
  }
}
```

**Errors:**
- 400: Gig already assigned / Bid already processed
- 403: Not authorized (not the gig owner)
- 404: Bid not found / Gig not found

**Race Condition Prevention:**
If two requests try to hire different freelancers simultaneously, only one will succeed. The other will receive a 400 error with message "This gig has already been assigned".

---

## Socket.IO Events

### Client → Server

#### Join Room
```javascript
socket.emit('join', userId);
```
Join the user's personal notification room.

### Server → Client

#### Hired Notification
```javascript
socket.on('hired', (data) => {
  // data = {
  //   gigTitle: "Build a React Website",
  //   gigId: "507f1f77bcf86cd799439012",
  //   bidId: "507f1f77bcf86cd799439013",
  //   message: "Congratulations! You have been hired for 'Build a React Website'!"
  // }
});
```

---

## Error Responses

### Validation Error (400)
```json
{
  "errors": [
    {
      "msg": "Please add a title",
      "param": "title",
      "location": "body"
    }
  ]
}
```

### General Error (400/500)
```json
{
  "message": "Error message here"
}
```

### Authentication Error (401)
```json
{
  "message": "Not authorized to access this route"
}
```

### Forbidden Error (403)
```json
{
  "message": "Not authorized to perform this action"
}
```

### Not Found Error (404)
```json
{
  "message": "Resource not found"
}
```

---

## Status Codes

- **200** OK - Request succeeded
- **201** Created - Resource created successfully
- **400** Bad Request - Invalid input/validation error
- **401** Unauthorized - Not authenticated
- **403** Forbidden - Not authorized
- **404** Not Found - Resource doesn't exist
- **500** Server Error - Internal server error

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production deployment.

## CORS

The API accepts requests from:
- `http://localhost:5173` (development)
- Your configured `CLIENT_URL` environment variable

Credentials (cookies) are supported with `credentials: true`.

---

**Happy coding! 🚀**
