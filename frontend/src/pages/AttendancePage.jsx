import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { FiUser, FiCheckCircle, FiClock, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import './AttendancePage.css';

const AttendancePage = () => {
  const navigate = useNavigate();
  const [registerNumber, setRegisterNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    checkActiveSession();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && step === 2) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 2) {
      toast.error('OTP expired. Please request a new one.');
      resetForm();
    }
  }, [timeLeft, step]);

  const checkActiveSession = async () => {
    try {
      const response = await api.get('/attendance/sessions/active');
      setActiveSession(response.data.data);
    } catch (error) {
      setActiveSession(null);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!registerNumber.trim()) {
      toast.error('Please enter your register number');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/attendance/request-otp', { registerNumber });
      setStudentInfo(response.data.data);
      setStep(2);
      setTimeLeft(parseInt(response.data.data.expiresIn) * 60);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/attendance/verify-otp', {
        registerNumber,
        otp
      });
      toast.success(response.data.message);
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRegisterNumber('');
    setOtp('');
    setStep(1);
    setStudentInfo(null);
    setTimeLeft(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeSession) {
    return (
      <div className="attendance-page">
        <div className="attendance-card">
          <div className="no-session">
            <FiCalendar size={64} />
            <h2>No Active Attendance Session</h2>
            <p>Please check back later when attendance is open.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn btn-secondary back-btn"
      >
        <FiArrowLeft /> 
      </button>
      
      <div className="attendance-card">
        <div className="attendance-header">
          <h1>Mark Your Attendance</h1>
          <p className="session-info">
            <FiCalendar /> {activeSession.sessionName}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="attendance-form">
            <div className="input-group">
              <label htmlFor="registerNumber">
                <FiUser /> Register Number
              </label>
              <input
                type="text"
                id="registerNumber"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                placeholder="Enter your register number"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Processing...' : 'Mark Attendance'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="attendance-form">
            <div className="otp-info">
              <FiCheckCircle size={48} color="var(--success)" />
              <p>OTP sent to your registered email</p>
              {timeLeft !== null && (
                <div className="otp-timer">
                  <FiClock />
                  <span>Time remaining: {formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-success btn-block" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button 
              type="button" 
              onClick={resetForm} 
              className="btn btn-secondary btn-block"
              style={{ marginTop: '10px' }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
