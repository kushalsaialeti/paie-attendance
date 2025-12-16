const express = require('express');
const router = express.Router();
const {
  getSessions,
  getActiveSession,
  openSession,
  closeSession,
  requestOTP,
  verifyOTP,
  getSessionRecords,
  getAttendanceReport,
  adminMarkAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiter for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many OTP requests. Please try again later.'
});

// Public routes
router.get('/sessions/active', getActiveSession);
router.post('/request-otp', otpLimiter, requestOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.use(protect);

router.get('/sessions', getSessions);
router.post('/sessions', authorize('super-admin', 'co-admin'), openSession);
router.put('/sessions/:id/close', authorize('super-admin', 'co-admin'), closeSession);
router.get('/sessions/:id/records', getSessionRecords);
router.get('/report', getAttendanceReport);
router.post('/admin-mark', authorize('super-admin', 'co-admin'), adminMarkAttendance);

module.exports = router;
