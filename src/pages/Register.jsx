import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  User,
  Mail,
  Lock,
  Calendar,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'Female'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.age || Number(formData.age) < 18 || Number(formData.age) > 120) {
      errs.age = 'Enter a valid age (18 - 120).';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData);
      showToast('Account registered successfully! Welcome to the portal.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        backgroundColor: 'var(--bg-app)',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(13, 148, 136, 0.08) 0%, rgba(248, 250, 252, 1) 75%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="logo-icon" style={{ width: '42px', height: '42px' }}>
              <Activity size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Smart Diabetes AI
              </div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--teal)', fontWeight: 700 }}>
                Clinical Decision Support
              </div>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Create Clinician Account
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Register to conduct risk assessments &amp; generate patient reports
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" htmlFor="fullName">
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <User
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
              {errors.fullName && <span className="form-error"><AlertCircle size={12} /> {errors.fullName}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" htmlFor="email">
                Institutional Email *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="doctor@hospital.edu"
                  value={formData.email}
                  onChange={handleChange}
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
              {errors.email && <span className="form-error"><AlertCircle size={12} /> {errors.email}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="age">
                  Age *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="18"
                    max="120"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="e.g. 35"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <Calendar
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
                {errors.age && <span className="form-error"><AlertCircle size={12} /> {errors.age}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
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
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error"><AlertCircle size={12} /> {errors.password}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              </div>
              {errors.confirmPassword && <span className="form-error"><AlertCircle size={12} /> {errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-teal"
              style={{ width: '100%', padding: '0.75rem' }}
              disabled={isLoading}
            >
              <UserPlus size={17} />
              <span>{isLoading ? 'Creating Account...' : 'Register Account'}</span>
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
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ← Back to System Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
