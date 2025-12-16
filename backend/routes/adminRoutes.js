const express = require('express');
const router = express.Router();
const {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  toggleAdminStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and super-admin role
router.use(protect);
router.use(authorize('super-admin'));

router.route('/')
  .get(getAdmins)
  .post(createAdmin);

router.route('/:id')
  .get(getAdmin)
  .put(updateAdmin)
  .delete(deleteAdmin);

router.put('/:id/toggle-status', toggleAdminStatus);

module.exports = router;
