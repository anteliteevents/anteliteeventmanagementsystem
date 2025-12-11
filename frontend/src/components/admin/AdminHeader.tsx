/**
 * Admin Header Component
 * 
 * Header section for admin dashboard with title and action buttons.
 * 
 * @component
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  activeView: string;
}

const VIEW_TITLES: Record<string, string> = {
  overview: '📊 Dashboard Overview',
  sales: '💰 Sales Department',
  payments: '💳 Payments Department',
  costing: '💰 Costing Department',
  proposals: '📄 Proposals Department',
  monitoring: '📊 Monitoring Department',
  policies: '📋 Policies Department',
  events: '📅 Events Management',
  booths: '🏢 Booth Management',
  users: '👥 User Management',
  reports: '📈 Reports & Analytics',
  settings: '⚙️ System Settings',
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeView }) => {
  return (
    <div className="admin-header">
      <h1>{VIEW_TITLES[activeView] || 'Admin Dashboard'}</h1>
      <div className="header-actions">
        <Link to="/events/new" className="btn-primary">
          ➕ Create Event
        </Link>
        <Link to="/modular-test" className="btn-secondary">
          🧪 Test Center
        </Link>
      </div>
    </div>
  );
};

export default AdminHeader;

