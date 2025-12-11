/**
 * Users Management View
 * Complete interface for managing users, roles, and permissions
 */

import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
import api from '../../services/api';
import './UsersManagementView.css';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  role: 'admin' | 'exhibitor';
  isActive: boolean;
  createdAt: string;
}

const UsersManagementView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    role: 'exhibitor' as 'admin' | 'exhibitor'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      alert('Error loading users: ' + (error.response?.data?.error?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const token = AuthService.getStoredToken();
      const response = await fetch(`http://localhost:3001/api/users/${userId}/toggle-active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (response.ok) {
        await loadUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isActive: !currentStatus });
        }
      }
    } catch (error: any) {
      alert('Error updating user: ' + error.message);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'admin' | 'exhibitor') => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      await loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error: any) {
      alert('Error updating role: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        alert('Please fill in all required fields');
        return;
      }
      await api.post('/users', formData);
      await loadUsers();
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        companyName: '',
        phone: '',
        role: 'exhibitor'
      });
      alert('User created successfully!');
    } catch (error: any) {
      alert('Error creating user: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/users/${selectedUser.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        phone: formData.phone,
        email: formData.email
      });
      await loadUsers();
      setShowEditModal(false);
      setSelectedUser(null);
      alert('User updated successfully!');
    } catch (error: any) {
      alert('Error updating user: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/users/${selectedUser.id}`);
      await loadUsers();
      setSelectedUser(null);
      alert('User deleted successfully!');
    } catch (error: any) {
      alert('Error deleting user: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicateUser = async () => {
    if (!selectedUser) return;
    try {
      const newEmail = prompt('Enter email for the duplicate user:', `${selectedUser.email.split('@')[0]}_copy@${selectedUser.email.split('@')[1]}`);
      if (!newEmail) return;
      const response = await api.post(`/users/${selectedUser.id}/duplicate`, { email: newEmail });
      await loadUsers();
      alert('User duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating user: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const openEditModal = () => {
    if (!selectedUser) return;
    setFormData({
      email: selectedUser.email,
      password: '',
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      companyName: selectedUser.companyName || '',
      phone: selectedUser.phone || '',
      role: selectedUser.role
    });
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && user.isActive) ||
      (filter === 'inactive' && !user.isActive) ||
      (filter === user.role);
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    exhibitors: users.filter(u => u.role === 'exhibitor').length,
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-management-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-actions" style={{ marginBottom: '1rem' }}>
          <button
            className="btn-create"
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ➕ Create New User
          </button>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-box">
            <div className="stat-value active">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-box">
            <div className="stat-value inactive">{stats.inactive}</div>
            <div className="stat-label">Inactive</div>
          </div>
          <div className="stat-box">
            <div className="stat-value admins">{stats.admins}</div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-box">
            <div className="stat-value exhibitors">{stats.exhibitors}</div>
            <div className="stat-label">Exhibitors</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({stats.active})
          </button>
          <button
            className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            Inactive ({stats.inactive})
          </button>
          <button
            className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
            onClick={() => setFilter('admin')}
          >
            Admins ({stats.admins})
          </button>
          <button
            className={`filter-btn ${filter === 'exhibitor' ? 'active' : ''}`}
            onClick={() => setFilter('exhibitor')}
          >
            Exhibitors ({stats.exhibitors})
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''} ${!user.isActive ? 'inactive' : ''}`}
            onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
          >
            <div className="user-card-header">
              <div className="user-avatar-large">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="user-header-info">
                <h3>{user.firstName} {user.lastName}</h3>
                <span className={`role-badge role-${user.role}`}>{user.role}</span>
              </div>
            </div>

            <div className="user-card-body">
              <div className="user-info-row">
                <span className="info-icon">📧</span>
                <span className="info-text">{user.email}</span>
              </div>
              {user.companyName && (
                <div className="user-info-row">
                  <span className="info-icon">🏢</span>
                  <span className="info-text">{user.companyName}</span>
                </div>
              )}
              {user.phone && (
                <div className="user-info-row">
                  <span className="info-icon">📞</span>
                  <span className="info-text">{user.phone}</span>
                </div>
              )}
              <div className="user-info-row">
                <span className="info-icon">📅</span>
                <span className="info-text">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="user-card-footer">
              <div className="user-status-toggle">
                <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
                <button
                  className="btn-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleActive(user.id, user.isActive);
                  }}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <div className="user-role-controls">
                <select
                  value={user.role}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChangeRole(user.id, e.target.value as 'admin' | 'exhibitor');
                  }}
                  className="role-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="exhibitor">Exhibitor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
          <p>{searchTerm ? 'Try a different search term' : 'No users in the system'}</p>
        </div>
      )}

      {/* Selected User Details Sidebar */}
      {selectedUser && (
        <div className="user-details-sidebar">
          <div className="sidebar-header">
            <h3>User Details</h3>
            <button onClick={() => setSelectedUser(null)} className="btn-close">✕</button>
          </div>
          <div className="sidebar-content">
            <div className="user-detail-avatar">
              <div className="avatar-large">
                {selectedUser.firstName[0]}{selectedUser.lastName[0]}
              </div>
              <h4>{selectedUser.firstName} {selectedUser.lastName}</h4>
              <span className={`role-badge role-${selectedUser.role}`}>
                {selectedUser.role}
              </span>
            </div>

            <div className="detail-section">
              <h4>Contact Information</h4>
              <div className="detail-item">
                <strong>Email:</strong> {selectedUser.email}
              </div>
              {selectedUser.companyName && (
                <div className="detail-item">
                  <strong>Company:</strong> {selectedUser.companyName}
                </div>
              )}
              {selectedUser.phone && (
                <div className="detail-item">
                  <strong>Phone:</strong> {selectedUser.phone}
                </div>
              )}
            </div>

            <div className="detail-section">
              <h4>Account Status</h4>
              <div className="detail-item">
                <strong>Status:</strong>
                <span className={`status-badge ${selectedUser.isActive ? 'status-active' : 'status-inactive'}`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="detail-item">
                <strong>Role:</strong>
                <span className={`role-badge role-${selectedUser.role}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div className="detail-item">
                <strong>Member Since:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="detail-section">
              <h4>Quick Actions</h4>
              <div className="action-buttons-vertical">
                <button
                  className="btn-action-full"
                  onClick={() => handleToggleActive(selectedUser.id, selectedUser.isActive)}
                  style={{ marginBottom: '0.5rem' }}
                >
                  {selectedUser.isActive ? '❌ Deactivate User' : '✅ Activate User'}
                </button>
                <button
                  className="btn-action-full"
                  onClick={() => handleChangeRole(selectedUser.id, selectedUser.role === 'admin' ? 'exhibitor' : 'admin')}
                  style={{ marginBottom: '0.5rem' }}
                >
                  🔄 Change Role to {selectedUser.role === 'admin' ? 'Exhibitor' : 'Admin'}
                </button>
                <button
                  className="btn-action-full"
                  onClick={openEditModal}
                  style={{ marginBottom: '0.5rem', backgroundColor: '#2196F3' }}
                >
                  ✏️ Edit User
                </button>
                <button
                  className="btn-action-full"
                  onClick={handleDuplicateUser}
                  style={{ marginBottom: '0.5rem', backgroundColor: '#FF9800' }}
                >
                  📋 Duplicate User
                </button>
                <button
                  className="btn-action-full"
                  onClick={handleDeleteUser}
                  style={{ backgroundColor: '#f44336' }}
                >
                  🗑️ Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'exhibitor' })}
                >
                  <option value="exhibitor">Exhibitor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateUser}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateUser}>Update User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementView;

