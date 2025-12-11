/**
 * Admin Sidebar Component
 * 
 * Navigation sidebar for the admin dashboard with user info and logout.
 * 
 * @component
 */

import React from 'react';
import { User } from '../../services/auth.service';
import './AdminSidebar.css';

interface AdminSidebarProps {
  user: User | null;
  activeView: string;
  sidebarOpen: boolean;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  activeView,
  sidebarOpen,
  onViewChange,
  onLogout,
  onToggleSidebar,
}) => {
  const menuItems = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'sales', label: '💰 Sales Department' },
    { id: 'payments', label: '💳 Payments Department' },
    { id: 'costing', label: '💰 Costing Department' },
    { id: 'proposals', label: '📄 Proposals Department' },
    { id: 'monitoring', label: '📊 Monitoring Department' },
    { id: 'policies', label: '📋 Policies' },
    { id: 'events', label: '📅 Events Management' },
    { id: 'booths', label: '🏢 Booth Management' },
    { id: 'users', label: '👥 User Management' },
    { id: 'reports', label: '📈 Reports' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-details">
              <div className="user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

