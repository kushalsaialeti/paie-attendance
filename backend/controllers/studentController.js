const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res, next) => {
  try {
    const { year, gender, search } = req.query;
    let query = { isActive: true };

    // Filter by year
    if (year) {
      query.year = year;
    }

    // Filter by gender
    if (gender) {
      query.gender = gender;
    }

    // Search by name or register number
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registerNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('createdBy', 'name email')
      .sort('registerNumber');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by register number
// @route   GET /api/students/register/:registerNumber
// @access  Public
exports.getStudentByRegister = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      registerNumber: req.params.registerNumber.toUpperCase(),
      isActive: true
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Return limited info for security
    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        registerNumber: student.registerNumber,
        email: student.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (Co-Admin and Super Admin)
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create({
      ...req.body,
      createdBy: req.admin.id
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Co-Admin and Super Admin)
exports.updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Don't allow updating certain fields
    delete req.body.currentStreak;
    delete req.body.longestStreak;
    delete req.body.lastAttendanceDate;

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Co-Admin and Super Admin)
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Soft delete
    student.isActive = false;
    await student.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student statistics
// @route   GET /api/students/:id/stats
// @access  Private
exports.getStudentStats = async (req, res, next) => {
  try {
    const AttendanceRecord = require('../models/AttendanceRecord');
    
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get attendance statistics
    const totalAttendance = await AttendanceRecord.countDocuments({
      student: student._id,
      status: 'Present'
    });

    res.status(200).json({
      success: true,
      data: {
        student: {
          name: student.name,
          registerNumber: student.registerNumber,
          year: student.year
        },
        totalAttendance,
        currentStreak: student.currentStreak,
        longestStreak: student.longestStreak,
        lastAttendanceDate: student.lastAttendanceDate
      }
    });
  } catch (error) {
    next(error);
  }
};
