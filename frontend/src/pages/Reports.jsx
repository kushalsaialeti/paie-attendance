import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiCalendar, FiDownload } from 'react-icons/fi';
import '../pages/Students.css';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (filterYear) params.year = filterYear;

      const response = await api.get('/attendance/report', { params });
      setReport(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const downloadCSV = () => {
    if (!report) return;

    const headers = ['Register Number', 'Name', 'Year', 'Email', 'Total Sessions', 'Attended', 'Percentage', 'Current Streak', 'Longest Streak'];
    const rows = report.report.map(r => [
      r.student.registerNumber,
      r.student.name,
      r.student.year,
      r.student.email,
      r.totalSessions,
      r.attendedSessions,
      r.attendancePercentage + '%',
      r.currentStreak,
      r.longestStreak
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Attendance Reports</h1>
          {report && (
            <button onClick={downloadCSV} className="btn btn-success">
              <FiDownload /> Download CSV
            </button>
          )}
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCalendar /> Filter Report
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label>Year</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={fetchReport} className="btn btn-primary">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : report ? (
          <>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{report.totalSessions}</h3>
                  <p>Total Sessions</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{report.totalStudents}</h3>
                  <p>Total Students</p>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Register No.</th>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Total Sessions</th>
                    <th>Attended</th>
                    <th>Percentage</th>
                    <th>Current Streak</th>
                    <th>Best Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {report.report.map((record) => (
                    <tr key={record.student.id}>
                      <td>{record.student.registerNumber}</td>
                      <td>{record.student.name}</td>
                      <td>Year {record.student.year}</td>
                      <td>{record.totalSessions}</td>
                      <td>{record.attendedSessions}</td>
                      <td>
                        <span 
                          className={`badge ${
                            record.attendancePercentage >= 75 
                              ? 'badge-success' 
                              : record.attendancePercentage >= 50 
                              ? 'badge-warning' 
                              : 'badge-danger'
                          }`}
                        >
                          {record.attendancePercentage}%
                        </span>
                      </td>
                      <td>🔥 {record.currentStreak}</td>
                      <td>⭐ {record.longestStreak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="card">
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              Click "Generate Report" to view attendance data
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports;
