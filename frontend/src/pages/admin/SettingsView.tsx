/**
 * Settings View
 * System configuration and settings management
 */

import React, { useState } from 'react';
import './SettingsView.css';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    systemName: 'Antelite Events System',
    companyName: 'Antelite Events',
    email: 'admin@anteliteevents.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    features: {
      stripeEnabled: true,
      emailEnabled: true,
      analyticsEnabled: true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedChange = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [key]: value,
      },
    }));
  };

  return (
    <div className="settings-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h2>⚙️ System Settings</h2>
          <p>Configure your event management system</p>
        </div>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>

      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('success') ? 'success' : ''}`}>
          {saveMessage}
        </div>
      )}

      {/* Settings Sections */}
      <div className="settings-sections">
        {/* General Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3>📋 General Settings</h3>
            <p>Basic system information and preferences</p>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>System Name</label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => handleChange('systemName', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3>🌍 Regional Settings</h3>
            <p>Localization and regional preferences</p>
          </div>
          <div className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="form-input"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="form-input"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="form-input"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3>🔔 Notification Settings</h3>
            <p>Configure how users receive notifications</p>
          </div>
          <div className="settings-form">
            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <label>Email Notifications</label>
                  <p>Send notifications via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <label>SMS Notifications</label>
                  <p>Send notifications via SMS</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <label>Push Notifications</label>
                  <p>Send browser push notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="settings-section">
          <div className="section-header">
            <h3>🚀 Feature Flags</h3>
            <p>Enable or disable system features</p>
          </div>
          <div className="settings-form">
            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <label>Stripe Payment Gateway</label>
                  <p>Enable Stripe for payment processing</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.features.stripeEnabled}
                    onChange={(e) => handleNestedChange('features', 'stripeEnabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <label>Email Service</label>
                  <p>Enable email notifications and communications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.features.emailEnabled}
                    onChange={(e) => handleNestedChange('features', 'emailEnabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <label>Analytics & Tracking</label>
                  <p>Enable analytics and usage tracking</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.features.analyticsEnabled}
                    onChange={(e) => handleNestedChange('features', 'analyticsEnabled', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="settings-section">
          <div className="section-header">
            <h3>ℹ️ System Information</h3>
            <p>System version and technical details</p>
          </div>
          <div className="system-info">
            <div className="info-item">
              <span className="info-label">Version:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Environment:</span>
              <span className="info-value">Development</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database:</span>
              <span className="info-value">PostgreSQL 18</span>
            </div>
            <div className="info-item">
              <span className="info-label">Backend API:</span>
              <span className="info-value">http://localhost:3001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

