const Admin = require('../models/Admin');

// @desc    Get all co-admins
// @route   GET /api/admins
// @access  Private (Super Admin only)
exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({ role: 'co-admin' })
      .select('-password')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single admin
// @route   GET /api/admins/:id
// @access  Private (Super Admin only)
exports.getAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};



// @desc Create initial super admin (ONE TIME)
// @route POST /api/setup/super-admin
// @access Public (disable after use)
exports.createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Super admin already exists"
      });
    }

    const superAdmin = await Admin.create({
      name,
      email,
      password,
      role: "super-admin"
    });

    res.status(201).json({
      success: true,
      message: "Super admin created successfully",
      data: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// @desc    Create co-admin
// @route   POST /api/admins
// @access  Private (Super Admin only)
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Prevent creating another super admin
    if (req.body.role === 'super-admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot create another super admin'
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: 'co-admin',
      createdBy: req.admin.id
    });

    res.status(201).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update co-admin
// @route   PUT /api/admins/:id
// @access  Private (Super Admin only)
exports.updateAdmin = async (req, res, next) => {
  try {
    let admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent updating super admin
    if (admin.role === 'super-admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update super admin'
      });
    }

    // Don't allow role change via this route
    delete req.body.role;
    delete req.body.password; // Password should be updated via separate route

    admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete co-admin
// @route   DELETE /api/admins/:id
// @access  Private (Super Admin only)
exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent deleting super admin
    if (admin.role === 'super-admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete super admin'
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle admin active status
// @route   PUT /api/admins/:id/toggle-status
// @access  Private (Super Admin only)
exports.toggleAdminStatus = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admin.role === 'super-admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate super admin'
      });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};
