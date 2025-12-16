import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock } from 'react-icons/fi';
import './Login.css';

const Login = ({ roleLabel = 'Admin' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signedIn = await login(email, password);
      toast.success('Login successful!');
      if (signedIn?.role === 'super-admin') {
        navigate('/dashboard');
      } else {
        navigate('/attendance-control');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>PAIE Attendance</h1>
          <p>{roleLabel} Login</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">
              <FiMail /> Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FiLock /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          {roleLabel === 'Super Admin' ? (
            <p>
              Co-Admin? <a href="/login-coadmin">Use co-admin login</a>
            </p>
          ) : (
            <p>
              Super Admin? <a href="/login-superadmin">Use super admin login</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
