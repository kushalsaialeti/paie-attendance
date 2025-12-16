# PAIE Attendance Management System

A production-ready OTP-based Attendance Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a modern blue-themed UI.

## 🌟 Features

### 🔐 User Roles & Permissions

#### Super Admin
- Create, update, and delete Co-Admin accounts
- Open and close attendance sessions
- Access and manage all attendance data
- View comprehensive attendance reports

#### Co-Admin
- Add, edit, and manage student details
- Open attendance pages
- View attendance records and student streaks

#### Students (No Login Required)
- Mark attendance via public page
- Receive OTP via email for verification
- No dashboard or login access

### 🔁 Attendance Workflow

1. Admin opens attendance session
2. Student navigates to public attendance page
3. Student enters Register Number and clicks "Mark Attendance"
4. System sends OTP to student's registered email
5. Student enters OTP to verify
6. System validates OTP and marks attendance
7. Attendance streak is automatically updated

### 🎨 Frontend Features

- Blue-themed modern UI
- Responsive design for all devices
- Real-time feedback messages
- Interactive dashboards
- CSV export for reports

### ⚙️ Backend Features

- JWT-based authentication
- Role-based access control
- OTP generation with expiry (3 minutes)
- Email integration via Nodemailer
- Rate limiting for security
- Input validation and sanitization

### 🗄️ Database Collections

- **Admins**: Super Admin and Co-Admin accounts
- **Students**: Student information and attendance streaks
- **AttendanceSessions**: Active and closed sessions
- **AttendanceRecords**: Attendance logs
- **OTPLogs**: OTP verification tracking

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Gmail account (for sending OTPs) or other email service

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd paie-attendance
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/paie-attendance

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d


# OTP Configuration
OTP_EXPIRY_MINUTES=3
OTP_LENGTH=6

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important**: For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASSWORD`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

The frontend `.env` file is already configured:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Start MongoDB:

```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### 5. Create Super Admin

Run the script to create the initial Super Admin account:

```bash
cd backend
node scripts/createSuperAdmin.js
```

**Default Super Admin Credentials:**
- Email: `superadmin@paie.edu`
- Password: `admin123456`

**⚠️ IMPORTANT: Change this password after first login!**

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
npm start

# For development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📱 Usage Guide

### For Super Admin

1. **Login**
   - Navigate to `http://localhost:3000/login`
   - Use Super Admin credentials
   
2. **Manage Co-Admins**
   - Go to "Co-Admins" section
   - Add, edit, or delete Co-Admin accounts
   - Toggle active/inactive status

3. **Open Attendance Session**
   - From Dashboard, click "Open Attendance Session"
   - Enter session name
   - Session becomes active for students

4. **Close Attendance Session**
   - From Dashboard, click "Close Session"
   - Confirms closure of active session

5. **View Reports**
   - Navigate to "Reports" section
   - Filter by date range and year
   - Download CSV export

### For Co-Admin

1. **Login**
   - Use credentials provided by Super Admin

2. **Manage Students**
   - Navigate to "Students" section
   - Add new students with:
     - Register Number (unique)
     - Name
     - Email (for OTP)
     - Gender
     - Year
   - Edit or delete existing students
   - Search and filter students

3. **View Attendance**
   - Navigate to "Attendance" section
   - View all sessions
   - Check attendance records per session

### For Students

1. **Mark Attendance**
   - Navigate to `http://localhost:3000/attendance-page`
   - Enter Register Number
   - Click "Mark Attendance"
   - Check email for OTP (6 digits)
   - Enter OTP within 3 minutes
   - Receive confirmation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **OTP Expiration**: 3-minute validity window
- **Rate Limiting**: 5 OTP requests per 15 minutes
- **One-Time Use**: OTPs are single-use only
- **Input Validation**: Server-side validation for all inputs
- **Role-Based Access**: Middleware for permission control
- **CORS Protection**: Configured for specific origin
- **Helmet.js**: Security headers

## 🎨 Color Palette

The application uses a beautiful blue gradient theme:

- **Primary Blue**: `#667eea`
- **Secondary Blue**: `#764ba2`
- **Light Blue**: `#f8f9ff`
- **Dark Blue**: `#4c5fd5`
- **Success**: `#48bb78`
- **Error**: `#f56565`
- **Warning**: `#ed8936`

## 📂 Project Structure

```
paie-attendance/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── AttendanceRecord.js
│   │   ├── AttendanceSession.js
│   │   ├── OTPLog.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   ├── scripts/
│   │   └── createSuperAdmin.js
│   ├── utils/
│   │   ├── email.js
│   │   ├── jwt.js
│   │   └── otp.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Navbar.css
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Attendance.js
    │   │   ├── AttendancePage.js
    │   │   ├── AttendancePage.css
    │   │   ├── CoAdmins.js
    │   │   ├── Dashboard.js
    │   │   ├── Dashboard.css
    │   │   ├── Login.js
    │   │   ├── Login.css
    │   │   ├── Reports.js
    │   │   ├── Students.js
    │   │   └── Students.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env
    ├── .gitignore
    └── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `PUT /api/auth/updatepassword` - Update password

### Admin Management (Super Admin Only)
- `GET /api/admins` - Get all co-admins
- `POST /api/admins` - Create co-admin
- `PUT /api/admins/:id` - Update co-admin
- `DELETE /api/admins/:id` - Delete co-admin
- `PUT /api/admins/:id/toggle-status` - Toggle active status

### Student Management
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/stats` - Get student statistics

### Attendance
- `GET /api/attendance/sessions` - Get all sessions
- `GET /api/attendance/sessions/active` - Get active session
- `POST /api/attendance/sessions` - Open session
- `PUT /api/attendance/sessions/:id/close` - Close session
- `POST /api/attendance/request-otp` - Request OTP (Public)
- `POST /api/attendance/verify-otp` - Verify OTP (Public)
- `GET /api/attendance/sessions/:id/records` - Get session records
- `GET /api/attendance/report` - Get attendance report

## 🐛 Troubleshooting

### Email Not Sending

1. Check Gmail settings:
   - 2FA enabled
   - App password generated and correct
2. Check `.env` file configuration
3. Verify EMAIL_USER and EMAIL_PASSWORD

### MongoDB Connection Failed

1. Ensure MongoDB is running
2. Check MONGODB_URI in `.env`
3. Verify MongoDB port (default: 27017)

### Frontend Cannot Connect to Backend

1. Ensure backend is running on port 5000
2. Check REACT_APP_API_URL in frontend `.env`
3. Verify CORS settings in backend

### OTP Expired Too Quickly

1. Adjust OTP_EXPIRY_MINUTES in backend `.env`
2. Default is 3 minutes

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables
2. Update MONGODB_URI to production database
3. Update FRONTEND_URL to production URL
4. Deploy backend code

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update REACT_APP_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy build folder

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs for errors

## 🎉 Features Implemented

✅ JWT Authentication  
✅ Role-based Access Control  
✅ OTP Email Verification  
✅ Attendance Streak Tracking  
✅ Real-time Session Management  
✅ Comprehensive Reports  
✅ CSV Export  
✅ Responsive Design  
✅ Input Validation  
✅ Rate Limiting  
✅ Security Best Practices  

---

**Built with ❤️ using the MERN Stack**
