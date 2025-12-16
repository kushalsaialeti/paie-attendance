import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import '../pages/Students.css';

const CoAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admins');
      setAdmins(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch co-admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await api.put(`/admins/${editingAdmin._id}`, {
          name: formData.name,
          email: formData.email
        });
        toast.success('Co-admin updated successfully!');
      } else {
        await api.post('/admins', formData);
        toast.success('Co-admin added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this co-admin?')) return;

    try {
      await api.delete(`/admins/${id}`);
      toast.success('Co-admin deleted successfully!');
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to delete co-admin');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admins/${id}/toggle-status`);
      toast.success('Status updated successfully!');
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setEditingAdmin(null);
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
          <h1>Co-Admin Management</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <FiPlus /> Add Co-Admin
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    {admin.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(admin)} className="btn-icon btn-edit" title="Edit">
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(admin._id)} 
                        className="btn-icon" 
                        style={{ color: admin.isActive ? '#ed8936' : '#10b981' }}
                        title={admin.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {admin.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button onClick={() => handleDelete(admin._id)} className="btn-icon btn-delete" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {admins.length === 0 && (
            <div className="no-data">No co-admins found</div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingAdmin ? 'Edit Co-Admin' : 'Add New Co-Admin'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {!editingAdmin && (
                  <div className="input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary">
                    {editingAdmin ? 'Update' : 'Add'} Co-Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
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

export default CoAdmins;
