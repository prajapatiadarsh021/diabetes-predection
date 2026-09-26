import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email format (e.g. user@domain.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      showToast('Signed in successfully. Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.message || 'Invalid credentials. Please try again.' });
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    showToast('Signed in as Demo Clinician (Dr. Alex Morgan)', 'success');
    navigate('/dashboard');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    showToast(`Password reset link sent to ${forgotEmail}`, 'success');
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--bg-app)',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(2, 132, 199, 0.08) 0%, rgba(248, 250, 252, 1) 75%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Branding header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="logo-icon" style={{ width: '42px', height: '42px' }}>
              <Activity size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Smart Diabetes AI
              </div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--teal)', fontWeight: 700 }}>
                Health Analytics System
              </div>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Sign in to access patient assessments &amp; health analytics
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Quick Demo Fill Button */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>Demonstration Mode</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDemoLogin}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              1-Click Demo Sign In
            </button>
          </div>

          {errors.form && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: 'var(--risk-high)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="loginEmail">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="loginEmail"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  required
                />
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
              {errors.email && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="loginPassword">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  required
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.password}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                fontSize: '0.82rem'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
              disabled={isLoading}
            >
              <LogIn size={17} />
              <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div
            style={{
              marginTop: '1.75rem',
              textAlign: 'center',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem'
            }}
          >
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ← Back to System Overview
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        footer={
          <>
            <button className="btn btn-outline btn-sm" onClick={() => setShowForgotModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleForgotSubmit}>
              Send Reset Link
            </button>
          </>
        }
      >
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          Enter your registered institutional email address. We will generate an automated password recovery link.
        </p>
        <div className="form-group">
          <label className="form-label" htmlFor="forgotEmailInput">
            Email Address
          </label>
          <input
            id="forgotEmailInput"
            type="email"
            className="form-input"
            placeholder="name@institution.edu"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
