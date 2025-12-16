# Quick Start Guide - PAIE Attendance System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Backend

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paie-attendance
JWT_SECRET=your_secret_key_change_in_production
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start MongoDB

```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### Step 4: Create Super Admin

```bash
cd backend
node scripts/createSuperAdmin.js
```

Default credentials:
- Email: `superadmin@paie.edu`
- Password: `admin123456`

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 6: Access the Application

- **Admin Login**: http://localhost:3000/login
- **Student Attendance**: http://localhost:3000/attendance-page

## 📋 First Time Setup Checklist

### For Super Admin:

1. ✅ Login with default credentials
2. ✅ Change your password (Settings)
3. ✅ Create Co-Admin accounts
4. ✅ Have Co-Admins add students

### For Co-Admin:

1. ✅ Login with credentials from Super Admin
2. ✅ Navigate to Students section
3. ✅ Add student details (Register Number, Name, Email, Gender, Year)
4. ✅ Verify student emails are correct (for OTP)

### For Attendance:

1. ✅ Open attendance session from Dashboard
2. ✅ Share attendance page URL with students
3. ✅ Students mark attendance using Register Number
4. ✅ Students receive OTP via email
5. ✅ Close session when done

## 🔐 Gmail Setup for OTP

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to Security > 2-Step Verification > App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Generate password
   - Copy and paste in `.env` as `EMAIL_PASSWORD`

## 🎯 Testing the System

### Test Attendance Flow:

1. Login as Admin
2. Open an attendance session
3. Go to http://localhost:3000/attendance-page
4. Enter a student's register number
5. Check the student's email for OTP
6. Enter OTP to mark attendance
7. View attendance record in Attendance section

## 📊 Common Tasks

### Add a Student:
1. Login as Co-Admin or Super Admin
2. Navigate to "Students"
3. Click "+ Add Student"
4. Fill in details and submit

### Generate Report:
1. Navigate to "Reports"
2. Select date range and year (optional)
3. Click "Generate Report"
4. Download CSV if needed

### Manage Co-Admins:
1. Login as Super Admin
2. Navigate to "Co-Admins"
3. Add, edit, or deactivate co-admins

## ⚠️ Important Notes

- **Email Configuration**: Must use valid Gmail App Password
- **MongoDB**: Must be running before starting backend
- **Port Conflicts**: Ensure ports 3000 and 5000 are available
- **OTP Validity**: OTPs expire after 3 minutes
- **One Attendance**: Students can mark attendance once per session
- **Security**: Change default Super Admin password immediately

## 🐛 Quick Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify .env file exists with correct values

**Email not sending:**
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASSWORD in .env

**Can't login:**
- Ensure you've created Super Admin
- Check email and password are correct

**OTP not received:**
- Check student email is correct
- Check spam folder
- Verify email configuration

## 📞 Need Help?

Check the full README.md for:
- Detailed API documentation
- Complete troubleshooting guide
- Deployment instructions
- Security best practices

---

**Happy Attendance Tracking! 🎉**
