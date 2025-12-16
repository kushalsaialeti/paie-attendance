import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiUsers, FiCheckCircle, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { admin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCoAdmins: 0,
    activeSessions: 0,
    todayAttendance: 0
  });
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionName, setSessionName] = useState('');
  const [showOpenModal, setShowOpenModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, sessionsRes] = await Promise.all([
        api.get('/students'),
        api.get('/attendance/sessions/active').catch(() => ({ data: { data: null } }))
      ]);

      let coAdminsCount = 0;
      if (isSuperAdmin) {
        const adminsRes = await api.get('/admins');
        coAdminsCount = adminsRes.data.count;
      }

      setStats({
        totalStudents: studentsRes.data.count,
        totalCoAdmins: coAdminsCount,
        activeSessions: sessionsRes.data.data ? 1 : 0,
        todayAttendance: 0
      });

      setActiveSession(sessionsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance/sessions', { sessionName });
      toast.success('Attendance session opened successfully!');
      setShowOpenModal(false);
      setSessionName('');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to open session');
    }
  };

  const handleCloseSession = async () => {
    if (!window.confirm('Are you sure you want to close this session?')) return;

    try {
      await api.put(`/attendance/sessions/${activeSession._id}/close`);
      toast.success('Attendance session closed successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to close session');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {admin?.name}!</h1>
          <p>Manage your attendance system from here</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0e7ff' }}>
              <FiUsers color="#667eea" size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce7f3' }}>
                <FiUsers color="#ec4899" size={32} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCoAdmins}</h3>
                <p>Co-Admins</p>
              </div>
            </div>
          )}

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#d1fae5' }}>
              <FiCheckCircle color="#10b981" size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.activeSessions}</h3>
              <p>Active Sessions</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <FiTrendingUp color="#f59e0b" size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.todayAttendance}</h3>
              <p>Today's Attendance</p>
            </div>
          </div>
        </div>

        <div className="session-control">
          <div className="card">
            <h2>
              <FiCalendar /> Attendance Session Control
            </h2>

            {activeSession ? (
              <div className="active-session-info">
                <div className="session-details">
                  <h3>{activeSession.sessionName}</h3>
                  <p>Started: {new Date(activeSession.startTime).toLocaleString()}</p>
                  <p>Opened by: {activeSession.openedBy?.name}</p>
                </div>
                <button onClick={handleCloseSession} className="btn btn-danger">
                  Close Session
                </button>
              </div>
            ) : (
              <div className="no-active-session">
                <p>No active attendance session</p>
                <button onClick={() => setShowOpenModal(true)} className="btn btn-primary">
                  Open Attendance Session
                </button>
              </div>
            )}
          </div>
        </div>

        {showOpenModal && (
          <div className="modal-overlay" onClick={() => setShowOpenModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Open Attendance Session</h2>
              <form onSubmit={handleOpenSession}>
                <div className="input-group">
                  <label htmlFor="sessionName">Session Name</label>
                  <input
                    type="text"
                    id="sessionName"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g., Morning Session - Dec 16"
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary">
                    Open Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOpenModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
