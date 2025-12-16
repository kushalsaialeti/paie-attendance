const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  getStudentByRegister,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/register/:registerNumber', getStudentByRegister);

// Protected routes
router.use(protect);

router.route('/')
  .get(getStudents)
  .post(authorize('super-admin', 'co-admin'), createStudent);

router.route('/:id')
  .get(getStudent)
  .put(authorize('super-admin', 'co-admin'), updateStudent)
  .delete(authorize('super-admin', 'co-admin'), deleteStudent);

router.get('/:id/stats', getStudentStats);

module.exports = router;
