import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ActivitySquare,
  History,
  BarChart3,
  UserCheck,
  LogOut,
  Home,
  X,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
    if (onClose) onClose();
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/predict', label: 'New Prediction', icon: ActivitySquare },
    { to: '/history', label: 'Prediction History', icon: History },
    { to: '/analytics', label: 'Health Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Clinician Profile', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="logo-container" onClick={onClose}>
            <div className="logo-icon">
              <Stethoscope size={22} />
            </div>
            <div className="logo-text">
              <span className="logo-title">Smart Diabetes</span>
              <span className="logo-subtitle">Risk AI System</span>
            </div>
          </NavLink>

          <button
            className="btn-icon nav-hamburger"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ display: isOpen ? 'flex' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-label">General</div>
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Home size={18} />
            <span>Landing Page</span>
          </NavLink>

          <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>
            Clinical Portal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user-card">
              <div className="user-avatar-circle">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">{user.role || 'Clinician'}</div>
              </div>
            </div>
          )}

          {user ? (
            <button
              className="btn-logout-sidebar"
              onClick={handleLogout}
              title="Sign out of system"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={onClose}
            >
              Sign In
            </NavLink>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontSize: '0.7rem',
              color: 'var(--text-light)',
              marginTop: '0.25rem'
            }}
          >
            <HeartHandshake size={13} color="var(--teal)" />
            <span>Academic AI Project v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
