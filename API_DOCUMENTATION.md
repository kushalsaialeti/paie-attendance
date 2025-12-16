# API Documentation - PAIE Attendance System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Login
**POST** `/auth/login`

Login admin user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "64abc123...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "super-admin"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2. Get Current Admin
**GET** `/auth/me`

Get currently logged-in admin details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "super-admin",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3. Update Password
**PUT** `/auth/updatepassword`

Update admin password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "new_jwt_token...",
  "admin": {
    "id": "64abc123...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "super-admin"
  }
}
```

---

## 👥 Admin Management Endpoints (Super Admin Only)

### 4. Get All Co-Admins
**GET** `/admins`

Get list of all co-admin accounts.

**Headers:** `Authorization: Bearer <token>` (Super Admin only)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc456...",
      "name": "Co-Admin 1",
      "email": "coadmin1@example.com",
      "role": "co-admin",
      "isActive": true,
      "createdBy": {
        "name": "Super Admin",
        "email": "superadmin@paie.edu"
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5. Create Co-Admin
**POST** `/admins`

Create a new co-admin account.

**Headers:** `Authorization: Bearer <token>` (Super Admin only)

**Request Body:**
```json
{
  "name": "New Co-Admin",
  "email": "newadmin@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "name": "New Co-Admin",
    "email": "newadmin@example.com",
    "role": "co-admin",
    "isActive": true
  }
}
```

### 6. Update Co-Admin
**PUT** `/admins/:id`

Update co-admin details (name, email).

**Headers:** `Authorization: Bearer <token>` (Super Admin only)

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "co-admin"
  }
}
```

### 7. Delete Co-Admin
**DELETE** `/admins/:id`

Delete a co-admin account.

**Headers:** `Authorization: Bearer <token>` (Super Admin only)

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

### 8. Toggle Admin Status
**PUT** `/admins/:id/toggle-status`

Activate or deactivate co-admin account.

**Headers:** `Authorization: Bearer <token>` (Super Admin only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "name": "Co-Admin",
    "isActive": false
  }
}
```

---

## 🎓 Student Management Endpoints

### 9. Get All Students
**GET** `/students`

Get list of all active students with optional filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `year` (optional): Filter by year (1, 2, 3, 4)
- `gender` (optional): Filter by gender
- `search` (optional): Search by name or register number

**Example:** `/students?year=2&search=john`

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "64abc901...",
      "registerNumber": "CSE2023001",
      "name": "John Doe",
      "email": "john@example.com",
      "gender": "Male",
      "year": "2",
      "isActive": true,
      "currentStreak": 5,
      "longestStreak": 10,
      "lastAttendanceDate": "2025-12-15T00:00:00.000Z",
      "createdBy": {
        "name": "Co-Admin",
        "email": "coadmin@example.com"
      }
    }
  ]
}
```

### 10. Get Single Student
**GET** `/students/:id`

Get details of a specific student.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc901...",
    "registerNumber": "CSE2023001",
    "name": "John Doe",
    "email": "john@example.com",
    "gender": "Male",
    "year": "2",
    "currentStreak": 5,
    "longestStreak": 10
  }
}
```

### 11. Get Student by Register Number
**GET** `/students/register/:registerNumber`

Get student details by register number (public endpoint).

**No Authentication Required**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64abc901...",
    "name": "John Doe",
    "registerNumber": "CSE2023001",
    "email": "john@example.com"
  }
}
```

### 12. Create Student
**POST** `/students`

Create a new student.

**Headers:** `Authorization: Bearer <token>` (Co-Admin or Super Admin)

**Request Body:**
```json
{
  "registerNumber": "CSE2023050",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "gender": "Female",
  "year": "1"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc902...",
    "registerNumber": "CSE2023050",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "gender": "Female",
    "year": "1",
    "currentStreak": 0,
    "longestStreak": 0
  }
}
```

### 13. Update Student
**PUT** `/students/:id`

Update student details.

**Headers:** `Authorization: Bearer <token>` (Co-Admin or Super Admin)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "janedoe@example.com",
  "year": "2"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc902...",
    "registerNumber": "CSE2023050",
    "name": "Jane Doe",
    "email": "janedoe@example.com",
    "year": "2"
  }
}
```

### 14. Delete Student
**DELETE** `/students/:id`

Soft delete a student (sets isActive to false).

**Headers:** `Authorization: Bearer <token>` (Co-Admin or Super Admin)

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

### 15. Get Student Statistics
**GET** `/students/:id/stats`

Get attendance statistics for a student.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "student": {
      "name": "John Doe",
      "registerNumber": "CSE2023001",
      "year": "2"
    },
    "totalAttendance": 45,
    "currentStreak": 5,
    "longestStreak": 10,
    "lastAttendanceDate": "2025-12-15T00:00:00.000Z"
  }
}
```

---

## 📋 Attendance Management Endpoints

### 16. Get All Sessions
**GET** `/attendance/sessions`

Get all attendance sessions with optional filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `isActive` (optional): Filter by active status (true/false)
- `startDate` (optional): Filter sessions from date
- `endDate` (optional): Filter sessions to date

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "64abc111...",
      "sessionName": "Morning Session - Dec 16",
      "date": "2025-12-16T00:00:00.000Z",
      "startTime": "2025-12-16T09:00:00.000Z",
      "endTime": "2025-12-16T10:00:00.000Z",
      "isActive": false,
      "openedBy": {
        "name": "Super Admin",
        "email": "superadmin@paie.edu"
      },
      "closedBy": {
        "name": "Super Admin",
        "email": "superadmin@paie.edu"
      }
    }
  ]
}
```

### 17. Get Active Session
**GET** `/attendance/sessions/active`

Get currently active attendance session.

**No Authentication Required**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc222...",
    "sessionName": "Evening Session - Dec 16",
    "date": "2025-12-16T00:00:00.000Z",
    "startTime": "2025-12-16T15:00:00.000Z",
    "isActive": true,
    "openedBy": {
      "name": "Co-Admin"
    }
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "No active attendance session"
}
```

### 18. Open Attendance Session
**POST** `/attendance/sessions`

Open a new attendance session.

**Headers:** `Authorization: Bearer <token>` (Co-Admin or Super Admin)

**Request Body:**
```json
{
  "sessionName": "Morning Session - Dec 17",
  "date": "2025-12-17"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc333...",
    "sessionName": "Morning Session - Dec 17",
    "date": "2025-12-17T00:00:00.000Z",
    "startTime": "2025-12-17T09:00:00.000Z",
    "isActive": true,
    "openedBy": {
      "name": "Super Admin",
      "email": "superadmin@paie.edu"
    }
  }
}
```

### 19. Close Attendance Session
**PUT** `/attendance/sessions/:id/close`

Close an active attendance session.

**Headers:** `Authorization: Bearer <token>` (Co-Admin or Super Admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc333...",
    "sessionName": "Morning Session - Dec 17",
    "isActive": false,
    "endTime": "2025-12-17T10:00:00.000Z",
    "closedBy": {
      "name": "Super Admin",
      "email": "superadmin@paie.edu"
    }
  }
}
```

### 20. Request OTP (Public)
**POST** `/attendance/request-otp`

Request OTP for marking attendance.

**No Authentication Required**

**Rate Limited:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "registerNumber": "CSE2023001"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your registered email",
  "data": {
    "expiresIn": 3
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "No active attendance session"
}
```

### 21. Verify OTP (Public)
**POST** `/attendance/verify-otp`

Verify OTP and mark attendance.

**No Authentication Required**

**Request Body:**
```json
{
  "registerNumber": "CSE2023001",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance marked successfully!",
  "data": {
    "student": {
      "name": "John Doe",
      "registerNumber": "CSE2023001"
    },
    "currentStreak": 6,
    "markedAt": "2025-12-16T09:15:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts remaining."
}
```

### 22. Get Session Records
**GET** `/attendance/sessions/:id/records`

Get all attendance records for a specific session.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "_id": "64abc444...",
      "student": {
        "registerNumber": "CSE2023001",
        "name": "John Doe",
        "email": "john@example.com",
        "year": "2",
        "gender": "Male"
      },
      "session": "64abc222...",
      "status": "Present",
      "markedAt": "2025-12-16T09:15:00.000Z",
      "ipAddress": "192.168.1.1"
    }
  ]
}
```

### 23. Get Attendance Report
**GET** `/attendance/report`

Generate comprehensive attendance report.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Report from date
- `endDate` (optional): Report to date
- `year` (optional): Filter by student year

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalSessions": 20,
    "totalStudents": 100,
    "report": [
      {
        "student": {
          "id": "64abc901...",
          "registerNumber": "CSE2023001",
          "name": "John Doe",
          "year": "2",
          "email": "john@example.com"
        },
        "totalSessions": 20,
        "attendedSessions": 18,
        "attendancePercentage": 90.00,
        "currentStreak": 5,
        "longestStreak": 10
      }
    ]
  }
}
```

---

## 📊 Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Authentication & Authorization

### Public Endpoints (No Token Required):
- `POST /auth/login`
- `GET /attendance/sessions/active`
- `GET /students/register/:registerNumber`
- `POST /attendance/request-otp`
- `POST /attendance/verify-otp`

### Protected Endpoints (Token Required):
- All `/auth/*` endpoints (except login)
- All `/students/*` endpoints (except register lookup)
- All `/attendance/*` endpoints (except public ones)

### Super Admin Only:
- All `/admins/*` endpoints

### Co-Admin & Super Admin:
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`
- `POST /attendance/sessions`
- `PUT /attendance/sessions/:id/close`

---

## 🧪 Testing with cURL

### Login Example:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@paie.edu","password":"admin123456"}'
```

### Get Students Example:
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Request OTP Example:
```bash
curl -X POST http://localhost:5000/api/attendance/request-otp \
  -H "Content-Type: application/json" \
  -d '{"registerNumber":"CSE2023001"}'
```

---

**For more information, refer to the main README.md file.**
