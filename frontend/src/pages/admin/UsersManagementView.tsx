/**
 * Users Management View
 * Complete interface for managing users, roles, and permissions
 */

import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
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

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = AuthService.getStoredToken();
      const response = await fetch('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
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
      const token = AuthService.getStoredToken();
      const response = await fetch(`http://localhost:3001/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        await loadUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      }
    } catch (error: any) {
      alert('Error updating role: ' + error.message);
    }
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
                >
                  {selectedUser.isActive ? '❌ Deactivate User' : '✅ Activate User'}
                </button>
                <button
                  className="btn-action-full"
                  onClick={() => handleChangeRole(selectedUser.id, selectedUser.role === 'admin' ? 'exhibitor' : 'admin')}
                >
                  🔄 Change Role to {selectedUser.role === 'admin' ? 'Exhibitor' : 'Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementView;

