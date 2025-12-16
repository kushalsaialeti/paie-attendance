const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Student = require('../models/Student');
const OTPLog = require('../models/OTPLog');
const { generateOTP, getOTPExpiry } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');

// @desc    Get all attendance sessions
// @route   GET /api/attendance/sessions
// @access  Private
exports.getSessions = async (req, res, next) => {
  try {
    const { startDate, endDate, isActive } = req.query;
    let query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await AttendanceSession.find(query)
      .populate('openedBy', 'name email')
      .populate('closedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active session
// @route   GET /api/attendance/sessions/active
// @access  Public
exports.getActiveSession = async (req, res, next) => {
  try {
    const session = await AttendanceSession.findOne({ isActive: true })
      .populate('openedBy', 'name');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'No active attendance session'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Open attendance session
// @route   POST /api/attendance/sessions
// @access  Private
exports.openSession = async (req, res, next) => {
  try {
    // Check if there's already an active session
    const activeSession = await AttendanceSession.findOne({ isActive: true });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'An attendance session is already active. Please close it first.'
      });
    }

    const session = await AttendanceSession.create({
      sessionName: req.body.sessionName,
      date: req.body.date || new Date(),
      startTime: new Date(),
      openedBy: req.admin.id,
      isActive: true
    });

    const populatedSession = await AttendanceSession.findById(session._id)
      .populate('openedBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close attendance session
// @route   PUT /api/attendance/sessions/:id/close
// @access  Private
exports.closeSession = async (req, res, next) => {
  try {
    const session = await AttendanceSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (!session.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Session is already closed'
      });
    }

    session.isActive = false;
    session.endTime = new Date();
    session.closedBy = req.admin.id;
    await session.save();

    const populatedSession = await AttendanceSession.findById(session._id)
      .populate('openedBy', 'name email')
      .populate('closedBy', 'name email');

    res.status(200).json({
      success: true,
      data: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request OTP for attendance
// @route   POST /api/attendance/request-otp
// @access  Public
exports.requestOTP = async (req, res, next) => {
  try {
    const { registerNumber } = req.body;

    if (!registerNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide register number'
      });
    }

    // Check if there's an active session
    const activeSession = await AttendanceSession.findOne({ isActive: true });

    if (!activeSession) {
      return res.status(400).json({
        success: false,
        message: 'No active attendance session'
      });
    }

    // Find student
    const student = await Student.findOne({
      registerNumber: registerNumber.toUpperCase(),
      isActive: true
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if already marked attendance
    const existingAttendance = await AttendanceRecord.findOne({
      student: student._id,
      session: activeSession._id
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this session'
      });
    }

    // Check for existing unused OTP
    const existingOTP = await OTPLog.findOne({
      student: student._id,
      session: activeSession._id,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (existingOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP already sent. Please check your email or wait for it to expire.'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // Save OTP
    await OTPLog.create({
      student: student._id,
      session: activeSession._id,
      otp,
      expiresAt
    });

    // Send OTP email
    await sendOTPEmail(student.email, otp, student.name);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your registered email',
      data: {
        expiresIn: process.env.OTP_EXPIRY_MINUTES || 3
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and mark attendance
// @route   POST /api/attendance/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { registerNumber, otp } = req.body;

    if (!registerNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide register number and OTP'
      });
    }

    // Check if there's an active session
    const activeSession = await AttendanceSession.findOne({ isActive: true });

    if (!activeSession) {
      return res.status(400).json({
        success: false,
        message: 'No active attendance session'
      });
    }

    // Find student
    const student = await Student.findOne({
      registerNumber: registerNumber.toUpperCase(),
      isActive: true
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find OTP log
    const otpLog = await OTPLog.findOne({
      student: student._id,
      session: activeSession._id,
      isUsed: false
    }).sort('-createdAt');

    if (!otpLog) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found. Please request OTP first.'
      });
    }

    // Check if OTP expired
    if (new Date() > otpLog.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (otpLog.attempts >= otpLog.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpLog.otp !== otp) {
      otpLog.attempts += 1;
      await otpLog.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${otpLog.maxAttempts - otpLog.attempts} attempts remaining.`
      });
    }

    // Mark OTP as used
    otpLog.isUsed = true;
    otpLog.isVerified = true;
    await otpLog.save();

    // Check if already marked attendance (double-check)
    const existingAttendance = await AttendanceRecord.findOne({
      student: student._id,
      session: activeSession._id
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked'
      });
    }

    // Mark attendance
    const attendance = await AttendanceRecord.create({
      student: student._id,
      session: activeSession._id,
      status: 'Present',
      ipAddress: req.ip
    });

    // Update student streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (student.lastAttendanceDate) {
      const lastDate = new Date(student.lastAttendanceDate);
      lastDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day
        student.currentStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        student.currentStreak = 1;
      }
      // If daysDiff === 0, same day - don't change streak
    } else {
      // First attendance
      student.currentStreak = 1;
    }

    // Update longest streak
    if (student.currentStreak > student.longestStreak) {
      student.longestStreak = student.currentStreak;
    }

    student.lastAttendanceDate = new Date();
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully!',
      data: {
        student: {
          name: student.name,
          registerNumber: student.registerNumber
        },
        currentStreak: student.currentStreak,
        markedAt: attendance.markedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin/co-admin mark attendance by register number (no OTP)
// @route   POST /api/attendance/admin-mark
// @access  Private (super-admin, co-admin)
exports.adminMarkAttendance = async (req, res, next) => {
  try {
    const { registerNumber, status = 'Present' } = req.body;

    if (!registerNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide register number'
      });
    }

    const activeSession = await AttendanceSession.findOne({ isActive: true });
    if (!activeSession) {
      return res.status(400).json({
        success: false,
        message: 'No active attendance session'
      });
    }

    const student = await Student.findOne({
      registerNumber: registerNumber.toUpperCase(),
      isActive: true
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const existingAttendance = await AttendanceRecord.findOne({
      student: student._id,
      session: activeSession._id
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this session'
      });
    }

    const normalizedStatus = status === 'Absent' ? 'Absent' : 'Present';

    const attendance = await AttendanceRecord.create({
      student: student._id,
      session: activeSession._id,
      status: normalizedStatus,
      ipAddress: req.ip,
      markedBy: req.admin.id
    });

    if (normalizedStatus === 'Present') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (student.lastAttendanceDate) {
        const lastDate = new Date(student.lastAttendanceDate);
        lastDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          student.currentStreak += 1;
        } else if (daysDiff > 1) {
          student.currentStreak = 1;
        }
      } else {
        student.currentStreak = 1;
      }

      if (student.currentStreak > student.longestStreak) {
        student.longestStreak = student.currentStreak;
      }

      student.lastAttendanceDate = new Date();
      await student.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Attendance marked',
      data: {
        student: {
          name: student.name,
          registerNumber: student.registerNumber
        },
        status: normalizedStatus,
        markedAt: attendance.markedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records for a session
// @route   GET /api/attendance/sessions/:id/records
// @access  Private
exports.getSessionRecords = async (req, res, next) => {
  try {
    const session = await AttendanceSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const records = await AttendanceRecord.find({ session: session._id })
      .populate('student', 'registerNumber name email year gender')
      .sort('markedAt');

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private
exports.getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, year } = req.query;

    let sessionQuery = {};
    if (startDate || endDate) {
      sessionQuery.date = {};
      if (startDate) sessionQuery.date.$gte = new Date(startDate);
      if (endDate) sessionQuery.date.$lte = new Date(endDate);
    }

    const sessions = await AttendanceSession.find(sessionQuery);
    const sessionIds = sessions.map(s => s._id);

    let studentQuery = { isActive: true };
    if (year) {
      studentQuery.year = year;
    }

    const students = await Student.find(studentQuery).sort('registerNumber');

    const report = await Promise.all(students.map(async (student) => {
      const attendanceCount = await AttendanceRecord.countDocuments({
        student: student._id,
        session: { $in: sessionIds },
        status: 'Present'
      });

      const attendancePercentage = sessions.length > 0
        ? ((attendanceCount / sessions.length) * 100).toFixed(2)
        : 0;

      return {
        student: {
          id: student._id,
          registerNumber: student.registerNumber,
          name: student.name,
          year: student.year,
          email: student.email
        },
        totalSessions: sessions.length,
        attendedSessions: attendanceCount,
        attendancePercentage: parseFloat(attendancePercentage),
        currentStreak: student.currentStreak,
        longestStreak: student.longestStreak
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        totalSessions: sessions.length,
        totalStudents: students.length,
        report
      }
    });
  } catch (error) {
    next(error);
  }
};
