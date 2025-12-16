import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiHome, FiUsers, FiUserPlus, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { admin, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <h2>PAIE Attendance</h2>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            <FiHome /> Dashboard
          </Link>

          <Link to="/attendance-control" className={`nav-link ${isActive('/attendance-control')}`}>
            <FiClipboard /> Control
          </Link>

          <Link to="/attendance" className={`nav-link ${isActive('/attendance')}`}>
            <FiClipboard /> Attendance
          </Link>

          <Link to="/students" className={`nav-link ${isActive('/students')}`}>
            <FiUsers /> Students
          </Link>

          {isSuperAdmin && (
            <Link to="/co-admins" className={`nav-link ${isActive('/co-admins')}`}>
              <FiUserPlus /> Co-Admins
            </Link>
          )}

          <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
            <FiBarChart2 /> Reports
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{admin?.name}</span>
            <span className="user-role">{admin?.role}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
