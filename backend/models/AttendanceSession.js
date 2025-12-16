const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  sessionName: {
    type: String,
    required: [true, 'Please provide a session name'],
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index for quick lookup of active sessions
attendanceSessionSchema.index({ isActive: 1, date: -1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
