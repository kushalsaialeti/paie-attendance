import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiLink2, FiPower, FiPlusCircle, FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import './AttendanceControl.css';

const AttendanceControl = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [closing, setClosing] = useState(false);
  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async () => {
    setLoading(true);
    try {
      const response = await api.get('/attendance/sessions/active');
      setActiveSession(response.data.data);
    } catch (error) {
      setActiveSession(null);
    } finally {
      setLoading(false);
    }
  };

  const openSession = async (e) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      toast.error('Please provide a session name');
      return;
    }
    setCreating(true);
    try {
      await api.post('/attendance/sessions', { sessionName });
      toast.success('Attendance session opened');
      setSessionName('');
      fetchActiveSession();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to open session');
    } finally {
      setCreating(false);
    }
  };

  const closeSession = async () => {
    if (!activeSession) return;
    setClosing(true);
    try {
      await api.put(`/attendance/sessions/${activeSession._id}/close`);
      toast.success('Attendance session closed');
      fetchActiveSession();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to close session');
    } finally {
      setClosing(false);
    }
  };

  const copyStudentLink = async () => {
    const url = `${window.location.origin}/attendance-page`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Student attendance link copied');
    } catch (error) {
      toast.error('Unable to copy link');
    }
  };

  return (
    <>
      <Navbar />
      <div className="control-wrapper">
        <div className="control-header">
          <div>
            <p className="eyebrow">Attendance Control</p>
            <h1>Manage live sessions</h1>
            <p className="subtitle">Open or close attendance and share the student link quickly.</p>
          </div>
          <div className="chip">Admin / Co-Admin</div>
        </div>

        <div className="control-grid">
          <div className="card status-card">
            <div className="card-title">
              <FiCalendar />
              <span>Current Session</span>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : activeSession ? (
              <>
                <div className="status-pill active">Active</div>
                <h2>{activeSession.sessionName}</h2>
                <p className="muted">Started at {new Date(activeSession.startTime).toLocaleString()}</p>
                <p className="muted">Opened by {activeSession.openedBy?.name || 'Admin'}</p>
                <div className="actions">
                  <button className="btn btn-secondary" onClick={copyStudentLink}>
                    <FiLink2 /> Copy student link
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate('/attendance-page')}>
                    <FiEdit /> Take Attendance
                  </button>
                  <button className="btn btn-danger" onClick={closeSession} disabled={closing}>
                    <FiPower /> {closing ? 'Closing...' : 'Close session'}
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <FiCheckCircle size={42} />
                <h3>No active session</h3>
                <p className="muted">Open a new attendance session to let students mark attendance.</p>
                <button className="btn btn-secondary" onClick={copyStudentLink}>
                  <FiLink2 /> Copy student link
                </button>
              </div>
            )}
          </div>

          <div className="card create-card">
            <div className="card-title">
              <FiPlusCircle />
              <span>Open a session</span>
            </div>
            <p className="muted" style={{ marginBottom: '1rem' }}>
              Name your session so students recognize it (e.g., "Morning Session - Dec 16").
            </p>
            <form onSubmit={openSession}>
              <div className="input-group">
                <label htmlFor="sessionName">Session name</label>
                <input
                  id="sessionName"
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., CSE Dept - Morning"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={creating}>
                {creating ? 'Opening...' : 'Open session'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceControl;
