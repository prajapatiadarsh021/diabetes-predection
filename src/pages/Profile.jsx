import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Building,
  Calendar,
  Shield,
  Key,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePrediction } from '../context/PredictionContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { predictions } = usePrediction();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Dr. Alex Morgan',
    email: user?.email || 'alex.morgan@healthai.edu',
    role: user?.role || 'Clinical Researcher',
    age: user?.age || 34,
    gender: user?.gender || 'Female',
    department: user?.department || 'Biomedical Informatics & Data Science',
    institution: user?.institution || 'University Health Sciences Institute'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showToast('Name and Email cannot be empty', 'error');
      return;
    }
    updateProfile(profileForm);
    setIsEditing(false);
    showToast('Clinician profile updated successfully!', 'success');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) {
      errs.currentPassword = 'Enter current password.';
    }
    if (!passwordForm.newPassword) {
      errs.newPassword = 'Enter new password.';
    } else if (passwordForm.newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters.';
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errs.confirmNewPassword = 'Passwords do not match.';
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      showToast('Password updated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Password update failed', 'error');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      showToast('Signed out successfully', 'info');
      navigate('/login');
    }
  };

  // Stats
  const totalAssessments = predictions.length;
  const highRiskCount = predictions.filter((p) => p.riskCategory === 'High Risk').length;
  const highRiskPct = totalAssessments > 0 ? Math.round((highRiskCount / totalAssessments) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Clinician Profile &amp; Account Settings</h1>
          <p>Manage your research credentials, clinical affiliations, and session security.</p>
        </div>

        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Avatar & Account Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div
              className="user-avatar-circle"
              style={{
                width: '76px',
                height: '76px',
                fontSize: '1.8rem',
                margin: '0 auto 1rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              {user?.name || 'Dr. Alex Morgan'}
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              {user?.role || 'Clinical Researcher'}
            </div>
            <span className="badge badge-info" style={{ marginBottom: '1.25rem' }}>
              Verified Healthcare Analyst
            </span>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.82rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                <span style={{ fontWeight: 600 }}>{user?.department || 'Biomedical Informatics'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Affiliation:</span>
                <span style={{ fontWeight: 600 }}>{user?.institution || 'University Health Institute'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Joined:</span>
                <span style={{ fontWeight: 600 }}>{user?.joinedDate || 'September 2025'}</span>
              </div>
            </div>
          </div>

          {/* Account Activity Stats */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={17} color="var(--primary)" />
              <span>Assessment Activity</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {totalAssessments}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluations Run</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--risk-high)' }}>
                  {highRiskPct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Risk Flagged</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Profile Details Form */}
          <div className="card">
            <div className="card-header">
              <div className="card-header-title">
                <User size={18} color="var(--primary)" />
                <span>Personal &amp; Professional Information</span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveProfile}>
                <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      className="form-input"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      className="form-input"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Role</label>
                    <input
                      name="role"
                      type="text"
                      className="form-input"
                      value={profileForm.role}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Division</label>
                    <input
                      name="department"
                      type="text"
                      className="form-input"
                      value={profileForm.department}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Institution / University</label>
                    <input
                      name="institution"
                      type="text"
                      className="form-input"
                      value={profileForm.institution}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age &amp; Gender</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        name="age"
                        type="number"
                        className="form-input"
                        style={{ width: '40%' }}
                        value={profileForm.age}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      />
                      <select
                        name="gender"
                        className="form-select"
                        style={{ width: '60%' }}
                        value={profileForm.gender}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Save size={15} />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-header-title">
                <Key size={18} color="var(--teal)" />
                <span>Security &amp; Password Update</span>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="currentPassword">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                        if (passwordErrors.currentPassword) setPasswordErrors((p) => ({ ...p, currentPassword: null }));
                      }}
                    />
                    {passwordErrors.currentPassword && (
                      <span className="form-error"><AlertCircle size={12} /> {passwordErrors.currentPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="newPassword">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                        if (passwordErrors.newPassword) setPasswordErrors((p) => ({ ...p, newPassword: null }));
                      }}
                    />
                    {passwordErrors.newPassword && (
                      <span className="form-error"><AlertCircle size={12} /> {passwordErrors.newPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmNewPassword">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      className="form-input"
                      placeholder="Re-type new password"
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value });
                        if (passwordErrors.confirmNewPassword) setPasswordErrors((p) => ({ ...p, confirmNewPassword: null }));
                      }}
                    />
                    {passwordErrors.confirmNewPassword && (
                      <span className="form-error"><AlertCircle size={12} /> {passwordErrors.confirmNewPassword}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-teal btn-sm">
                    <Shield size={15} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
