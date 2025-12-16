import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiCalendar, FiEye } from 'react-icons/fi';
import '../pages/Students.css';

const Attendance = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/attendance/sessions');
      setSessions(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const viewSessionRecords = async (session) => {
    setSelectedSession(session);
    try {
      const response = await api.get(`/attendance/sessions/${session._id}/records`);
      setRecords(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch records');
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
      <div className="page-container">
        <div className="page-header">
          <h1>Attendance Sessions</h1>
        </div>

        {!selectedSession ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Session Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Opened By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{session.sessionName}</td>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>
                      {session.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Closed</span>
                      )}
                    </td>
                    <td>{session.openedBy?.name}</td>
                    <td>
                      <button 
                        onClick={() => viewSessionRecords(session)} 
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        <FiEye /> View Records
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sessions.length === 0 && (
              <div className="no-data">No sessions found</div>
            )}
          </div>
        ) : (
          <div>
            <button 
              onClick={() => { setSelectedSession(null); setRecords([]); }} 
              className="btn btn-secondary"
              style={{ marginBottom: '1rem' }}
            >
              ← Back to Sessions
            </button>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <FiCalendar /> {selectedSession.sessionName}
              </h2>
              <p style={{ color: 'var(--text-light)' }}>
                Date: {new Date(selectedSession.date).toLocaleDateString()} | 
                Total Attendance: {records.length}
              </p>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Register Number</th>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Email</th>
                    <th>Marked At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.student?.registerNumber}</td>
                      <td>{record.student?.name}</td>
                      <td>Year {record.student?.year}</td>
                      <td>{record.student?.email}</td>
                      <td>{new Date(record.markedAt).toLocaleTimeString()}</td>
                      <td>
                        <span className="badge badge-success">{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {records.length === 0 && (
                <div className="no-data">No attendance records for this session</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
