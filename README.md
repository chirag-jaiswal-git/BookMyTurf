# ⚽ BookMyTurf — Turf Booking Platform

A full-stack **MERN-based sports turf booking platform** that enables users to discover sports venues, view available slots, make bookings, and manage their reservations. The platform includes secure **email/password authentication**, JWT-protected routes, booking cancellation, and a dedicated **Admin Dashboard** for venue and booking management with real-time notifications.

## 🌐 Live Demo

**User Website:**
https://book-my-turf-jta8.vercel.app/

**GitHub Repository:**
https://github.com/chirag-jaiswal-git/BookMyTurf

---

# 🚀 Features

## 👤 User Features

* 🔐 Secure Email/Password Authentication
* 📝 User Registration and Login
* 🏟️ Browse Available Sports Turfs
* 🔍 Explore Sports Venues
* 📖 View Detailed Turf Information
* 📅 Select Booking Date
* ⏰ Select Available Time Slots
* 🎟️ Book Sports Turfs
* 💰 Automatic Booking Price Calculation
* 📋 View Personal Bookings
* ❌ Cancel Bookings
* 🔒 JWT-Protected User Routes
* 📱 Responsive User Interface

## 🛠️ Admin Features

* 📊 Dedicated Admin Dashboard
* 🔐 Secure Admin Authentication
* ➕ Add New Sports Venues
* 🖼️ Upload Venue Images
* ☁️ Cloudinary Image Storage
* 🗑️ Remove Venues
* 📋 View All Bookings
* 🔄 Update Booking Status
* 🔔 Real-Time New Booking Notifications
* 📡 Real-Time Communication using Socket.IO

## ⚡ Booking System

The booking system supports:

* Date-based bookings
* Time-slot selection
* Automatic price calculation
* Duplicate time-slot prevention
* Booking status management
* User-specific booking history
* Booking cancellation
* MongoDB-based persistent booking data

---

# 🧰 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Toastify
* Lucide React

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* Passport.js
* Passport Local Strategy
* bcrypt
* Socket.IO
* Cloudinary
* Multer

## Admin Panel

* React.js
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client

---

# 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │     User Frontend   │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Express Server   │
                    │       Node.js       │
                    └──────┬────────┬─────┘
                           │        │
                ┌──────────┘        └──────────┐
                ▼                              ▼
       ┌─────────────────┐            ┌─────────────────┐
       │    MongoDB      │            │   Cloudinary    │
       │   Database      │            │ Venue Images    │
       └─────────────────┘            └─────────────────┘
                           │
                           │ Socket.IO
                           ▼
                    ┌─────────────────────┐
                    │    Admin Panel      │
                    │   React + Vite      │
                    └─────────────────────┘
```

---

# 📂 Project Structure

```text
BookMyTurf/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── data/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Images/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket.js
│   ├── index.js
│   └── package.json
│
├── admin/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── assets/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation and Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/chirag-jaiswal-git/BookMyTurf.git
```

```bash
cd BookMyTurf
```

---

## 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

Start the backend:

```bash
npm run server
```

or:

```bash
npm start
```

---

# 3️⃣ Setup User Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 4️⃣ Setup Admin Panel

Open another terminal:

```bash
cd admin
npm install
```

Start the admin panel:

```bash
npm run dev
```

The admin panel will normally run at:

```text
http://localhost:5174
```

---

# 🔐 Environment Variables

| Variable                | Description                            |
| ----------------------- | -------------------------------------- |
| `PORT`                  | Backend server port                    |
| `MONGODB_URI`           | MongoDB connection string              |
| `JWT_SECRET`            | Secret key used for JWT authentication |
| `ADMIN_EMAIL`           | Admin login email                      |
| `ADMIN_PASSWORD`        | Admin login password                   |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                  |
| `FRONTEND_URL`          | User frontend URL                      |
| `ADMIN_URL`             | Admin panel URL                        |
| `VITE_BACKEND_URL`      | Backend API URL used by the frontend   |

> ⚠️ Never commit `.env` files or expose secret credentials in the repository.

---

# 🔐 Authentication Flow

BookMyTurf uses **Passport.js Local Strategy**, bcrypt, and JWT for authentication.

```text
User
  ↓
Register
  ↓
Name + Email + Phone + Password
  ↓
Password Hashed using bcrypt
  ↓
User Stored in MongoDB
  ↓
Login with Email + Password
  ↓
Passport Local Strategy
  ↓
Credentials Verified
  ↓
JWT Token Generated
  ↓
Protected Routes Accessible
```

Protected API requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# 📅 Booking Flow

```text
User
  ↓
Browse Venues
  ↓
Select Turf
  ↓
Choose Date
  ↓
Select Time Slot
  ↓
Confirm Booking
  ↓
Backend Validates Venue & Slot
  ↓
Calculate Total Price
  ↓
Booking Stored in MongoDB
  ↓
Socket.IO Emits "newBooking"
  ↓
Admin Dashboard Receives Notification
```

The backend prevents duplicate active bookings for the same:

```text
Venue + Date + Time Slot
```

---

# 🔔 Real-Time Notifications

The Admin Dashboard uses **Socket.IO** for real-time new-booking notifications.

When a user creates a booking:

```text
User Creates Booking
        ↓
Backend Saves Booking
        ↓
Socket.IO Emits "newBooking"
        ↓
Admin Dashboard Receives Event
        ↓
Notification Toast Appears
        ↓
Booking List Refreshes
```

This allows administrators to see newly created bookings without manually refreshing the page.

---

# 🖼️ Venue Image Management

Venue images are uploaded through the admin panel.

```text
Admin
  ↓
Select Venue Images
  ↓
Multer Handles Upload
  ↓
Cloudinary Upload
  ↓
Cloudinary URL Stored in MongoDB
  ↓
Frontend Displays Venue Images
```

---

# 🔒 Security Features

* 🔐 Email/password authentication
* 🔑 bcrypt password hashing
* 🛂 Passport.js Local Strategy
* 🎫 JWT-based authorization
* 🛡️ Protected user routes
* 🛡️ Protected admin routes
* 🔑 Bearer token authentication
* 🔒 Environment variables for sensitive credentials
* 🚫 Duplicate booking prevention
* ✅ Server-side booking validation
* 🗄️ Persistent MongoDB data storage

---

# 📡 API Overview

## Authentication

```text
POST /auth/signup
POST /auth/login
POST /auth/admin
```

## Venues

```text
GET  /venue/list
POST /venue/single
POST /venue/add
POST /venue/remove
```

## Bookings

```text
POST /booking/create
GET  /booking/my
PUT  /booking/cancel/:id
GET  /booking/all
PUT  /booking/status/:id
```

Admin-only routes are protected using JWT-based admin authentication.

---

# 🎯 Future Improvements

* 💳 Online Payment Integration
* 🤖 AI Chatbot for User Support
* ⭐ Venue Reviews and Ratings
* 📍 Google Maps Integration
* 📱 Enhanced Mobile Experience
* 📊 Advanced Admin Analytics
* 🔔 Push Notifications
* 🎫 Discount and Coupon System
* 🏆 Tournament Management
* 📧 Booking Email Notifications

---

# 👨‍💻 Author

**Chirag Jaiswal**

**MERN Stack Developer | Software Developer**

* GitHub: https://github.com/chirag-jaiswal-git
* LinkedIn: https://www.linkedin.com/in/chirag-jaiswal18/

---

# ⭐ Support

If you found **BookMyTurf** useful, consider giving the repository a **star ⭐**.

---

## 📄 License

This project is developed for educational and learning purposes.

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>

<p align="center">
  ⚽ <strong>BookMyTurf</strong> — Book Your Game. Play Without Limits.
</p>
