const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  registerNumber: {
    type: String,
    required: [true, 'Please provide a register number'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Please provide gender'],
    enum: ['Male', 'Female', 'Other']
  },
  year: {
    type: String,
    required: [true, 'Please provide year'],
    enum: ['1', '2', '3', '4']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastAttendanceDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
