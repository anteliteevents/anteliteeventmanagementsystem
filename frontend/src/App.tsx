import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import EventForm from './pages/EventForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModularTest from './pages/ModularTest';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthService from './services/auth.service';
import './App.css';

function App() {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getStoredUser();

  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <h2>Ant Elite Events</h2>
            </Link>
            <div className="nav-links">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' ? (
                    <Link to="/admin">🎛️ Admin Panel</Link>
                  ) : (
                    <Link to="/dashboard">Dashboard</Link>
                  )}
                  <Link to="/events">Events</Link>
                  <Link to="/modular-test">🧪 Test Center</Link>
                  {user?.role === 'admin' && (
                    <Link to="/events/new">Create Event</Link>
                  )}
                  <span className="nav-user">Hello, {user?.firstName}</span>
                </>
              ) : (
                <>
                  <Link to="/events">Events</Link>
                  <Link to="/modular-test">🧪 Test Center</Link>
                  <Link to="/login">Login</Link>
                  <Link to="/register" className="btn-nav-register">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/new"
              element={
                <ProtectedRoute>
                  <EventForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EventForm />
                </ProtectedRoute>
              }
            />
            <Route path="/modular-test" element={<ModularTest />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Ant Elite Events System</h1>
        <p className="hero-subtitle">Professional Event Management & Booth Sales Platform</p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-hero-primary">
                Go to Dashboard →
              </Link>
              <Link to="/events" className="btn-hero-secondary">
                Browse Events
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-hero-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-hero-secondary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Event Management</h3>
            <p>Create and manage events with ease. Track all your events in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Booth Sales</h3>
            <p>Interactive booth selection with real-time availability updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>Integrated Stripe payment processing for seamless transactions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>User Management</h3>
            <p>Role-based access control for admins and exhibitors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

