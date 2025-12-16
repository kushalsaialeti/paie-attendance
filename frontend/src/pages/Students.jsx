import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [formData, setFormData] = useState({
    registerNumber: '',
    name: '',
    email: '',
    gender: 'Male',
    year: '1'
  });

  useEffect(() => {
    fetchStudents();
  }, [filterYear]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filterYear) params.year = filterYear;
      
      const response = await api.get('/students', { params });
      setStudents(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
        toast.success('Student updated successfully!');
      } else {
        await api.post('/students', formData);
        toast.success('Student added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      registerNumber: student.registerNumber,
      name: student.name,
      email: student.email,
      gender: student.gender,
      year: student.year
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted successfully!');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const resetForm = () => {
    setFormData({
      registerNumber: '',
      name: '',
      email: '',
      gender: 'Male',
      year: '1'
    });
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1>Student Management</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <FiPlus /> Add Student
          </button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by name or register number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Register Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Year</th>
                <th>Streak</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.registerNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.gender}</td>
                  <td>Year {student.year}</td>
                  <td>
                    <span className="badge badge-primary">
                      🔥 {student.currentStreak}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(student)} className="btn-icon btn-edit">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(student._id)} className="btn-icon btn-delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="no-data">No students found</div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Register Number</label>
                  <input
                    type="text"
                    value={formData.registerNumber}
                    onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value.toUpperCase() })}
                    required
                    disabled={editingStudent}
                  />
                </div>

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

                <div className="input-group">
                  <label>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary">
                    {editingStudent ? 'Update' : 'Add'} Student
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

export default Students;
