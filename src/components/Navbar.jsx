import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Activity,
  User,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications popover on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Overview';
      case '/dashboard':
        return 'Clinical Dashboard';
      case '/predict':
        return 'Diabetes Risk Assessment Form';
      case '/result':
        return 'Prediction Risk Analysis Report';
      case '/history':
        return 'Patient Assessment History';
      case '/analytics':
        return 'Population Health Analytics';
      case '/profile':
        return 'Clinician Profile & Settings';
      case '/login':
        return 'Portal Sign In';
      case '/register':
        return 'Clinician Registration';
      default:
        return 'Smart Health AI';
    }
  };

  const notificationsList = [
    {
      id: 1,
      type: 'alert',
      title: 'High Risk Cluster Flagged',
      time: '15m ago',
      desc: '3 assessments today exceeded 75% risk threshold.'
    },
    {
      id: 2,
      type: 'success',
      title: 'Model Validation Sync',
      time: '2h ago',
      desc: 'Algorithm accuracy verified at 87.2% across benchmark cohort.'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Operational',
      time: '1d ago',
      desc: 'Inference engine calibrated with Pima clinical ranges.'
    }
  ];

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="nav-hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-brand-mobile">
          <Activity size={20} color="#0284c7" />
          <span>Smart Diabetes AI</span>
        </div>

        <nav className="nav-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>
            System
          </Link>
          <ChevronRight size={14} className="separator" />
          <span className="active-crumb">{getBreadcrumbTitle()}</span>
        </nav>
      </div>

      <div className="navbar-right">
        <div className="system-status-indicator" title="Inference Engine Active & Ready">
          <span className="status-dot"></span>
          <span>AI Engine Ready</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <button
            className="btn-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View system notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '7px',
                height: '7px',
                backgroundColor: 'var(--risk-high)',
                borderRadius: '50%'
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'modal-fade-in 0.2s ease-out'
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Clinical Alerts</span>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  3 Unread
                </span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      gap: '0.65rem',
                      fontSize: '0.8rem',
                      alignItems: 'flex-start',
                      backgroundColor: item.type === 'alert' ? '#fffaf8' : 'transparent'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {item.type === 'alert' && <AlertTriangle size={15} color="var(--risk-mod)" />}
                      {item.type === 'success' && <CheckCircle2 size={15} color="var(--risk-low)" />}
                      {item.type === 'info' && <ShieldCheck size={15} color="var(--primary)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                      <div style={{ color: 'var(--text-light)', fontSize: '0.7rem', marginTop: '4px' }}>
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: '0.65rem',
                  textAlign: 'center',
                  background: 'var(--bg-subtle)',
                  borderTop: '1px solid var(--border-color)'
                }}
              >
                <Link
                  to="/analytics"
                  onClick={() => setShowNotifications(false)}
                  style={{ fontSize: '0.78rem', fontWeight: 600 }}
                >
                  View All Analytics Alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        {user ? (
          <Link to="/profile" className="nav-user-pill" title="View Clinician Profile">
            <div className="user-avatar-circle">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name.split(' ')[0]}
            </span>
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
