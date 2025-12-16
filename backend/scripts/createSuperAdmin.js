require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const connectDatabase = require('../config/database');
const Admin = require('../models/Admin');

// Connect to database
connectDatabase();

// Create super admin
const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });

    if (existingSuperAdmin) {
      console.log('Super Admin already exists!');
      console.log('Email:', existingSuperAdmin.email);
      process.exit();
    }

    // Create super admin
    const superAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'superadmin@paie.edu',
      password: 'admin123456', // Change this password after first login!
      role: 'super-admin'
    });

    console.log('Super Admin created successfully!');
    console.log('Email:', superAdmin.email);
    console.log('Password: admin123456');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
