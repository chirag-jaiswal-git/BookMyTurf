# ⚽ BookMyTurf — Turf Booking Platform

A full-stack **MERN-based sports venue booking platform** that enables users to discover sports turfs, book available time slots, and manage their bookings with secure **email/password authentication**. The project also includes a dedicated **Admin Dashboard** for managing venues, bookings, booking statuses, and real-time booking notifications.

## 🚀 Live Features

### 👤 User Features

* 🔐 Secure Email/Password Authentication
* 📝 User Registration and Login
* 🏟️ Browse Available Sports Turfs
* 🔍 Search and Select Sports Venues
* 📅 Select Booking Date and Time Slot
* 📖 View Detailed Turf Information
* 🎟️ Book Sports Venues
* 📋 View Personal Bookings
* ❌ Cancel Bookings
* 🔒 Protected Routes using JWT Authentication

### 🛠️ Admin Features

* 📊 Dedicated Admin Dashboard
* ➕ Add New Venues
* 🗑️ Remove Venues
* 📋 View All Bookings
* 🔄 Update Booking Status
* 🔔 Real-Time New Booking Notifications
* 📡 Real-Time Communication using Socket.IO

## 🖼️ Screenshots

### 🏠 Home Page

![Home Page](./screenshots/home.png)

### 🔐 Authentication

![Authentication](./screenshots/auth.png)

### 🏟️ Turf Details

![Turf Details](./screenshots/turf-details.png)

### 📋 My Bookings

![My Bookings](./screenshots/my-bookings.png)

### 🛠️ Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

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

# ⚙️ Installation and Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/chirag-jaiswal-git/BookMyTurf.git
```

Move into the project directory:

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

Start the backend server:

```bash
npm run server
```

or:

```bash
npm start
```

---

## 3️⃣ Setup User Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

---

## 4️⃣ Setup Admin Panel

Open another terminal:

```bash
cd admin
npm install
```

Start the admin panel:

```bash
npm run dev
```

---

# 🔐 Environment Variables

| Variable                | Description                          |
| ----------------------- | ------------------------------------ |
| `PORT`                  | Backend server port                  |
| `MONGODB_URI`           | MongoDB connection string            |
| `JWT_SECRET`            | Secret key for JWT authentication    |
| `ADMIN_EMAIL`           | Admin login email                    |
| `ADMIN_PASSWORD`        | Admin login password                 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                |
| `FRONTEND_URL`          | User frontend URL                    |
| `ADMIN_URL`             | Admin panel URL                      |
| `VITE_BACKEND_URL`      | Backend API URL used by the frontend |

# 🔐 Authentication Flow

```text
User
  ↓
Register with Name, Email, Phone & Password
  ↓
Password Hashed using bcrypt
  ↓
User Stored in MongoDB
  ↓
Login with Email & Password
  ↓
Passport Local Strategy Verifies Credentials
  ↓
JWT Token Generated
  ↓
User Logged In
```

# 📅 Booking Flow

```text
User
  ↓
Select Turf
  ↓
Choose Date
  ↓
Select Time Slot
  ↓
Confirm Booking
  ↓
Backend Validates Availability
  ↓
Booking Stored in MongoDB
  ↓
Socket.IO Sends New Booking Event
  ↓
Admin Dashboard Receives Notification
  ↓
Booking Appears in Admin Dashboard
```

# 🔔 Real-Time Notifications

The Admin Dashboard uses **Socket.IO** to receive new booking events in real time.

When a user makes a booking:

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
Booking List Updates Automatically
```

# 🔒 Security Features

* Secure email/password authentication
* Password hashing using bcrypt
* Passport.js Local Strategy
* JWT-based authorization
* Protected user routes
* Protected admin routes
* Admin authentication
* Bearer token authorization
* Environment variables for sensitive credentials
* Duplicate time-slot prevention
* MongoDB validation and persistent data management

# 🎯 Future Improvements

* 💳 Online Payment Integration
* 🤖 AI Chatbot for User Support
* ⭐ Venue Reviews and Ratings
* 📍 Google Maps Integration
* 📱 Improved Mobile Experience
* 📊 Advanced Admin Analytics
* 🔔 Push Notifications
* 🎫 Discount and Coupon System
* 🏆 Tournament Management
* 📧 Booking Email Notifications

# 👨‍💻 Author

**Chirag Jaiswal**

* GitHub: https://github.com/chirag-jaiswal-git
* LinkedIn: https://www.linkedin.com/in/chirag-jaiswal18/

# ⭐ Support

If you found this project useful, please consider giving the repository a **star ⭐**.

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
