import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { usePrediction } from '../context/PredictionContext';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import ChartCard from '../components/ChartCard';
import Modal from '../components/Modal';
import RiskCard from '../components/RiskCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { predictions, setActivePrediction } = usePrediction();
  const { user } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Calculate metrics
  const total = predictions.length;
  const highRiskCount = predictions.filter((p) => p.riskCategory === 'High Risk').length;
  const moderateRiskCount = predictions.filter((p) => p.riskCategory === 'Moderate Risk').length;
  const lowRiskCount = predictions.filter((p) => p.riskCategory === 'Low Risk').length;

  const avgRisk = total > 0
    ? (predictions.reduce((acc, p) => acc + (p.probability || 0), 0) / total).toFixed(1)
    : 0;

  // Donut chart data for risk distribution
  const pieData = [
    { name: 'Low Risk (<30%)', value: lowRiskCount, color: '#10b981' },
    { name: 'Moderate (30-60%)', value: moderateRiskCount, color: '#f59e0b' },
    { name: 'High Risk (>60%)', value: highRiskCount, color: '#ef4444' }
  ];

  // Trend data over time (sorted chronologically)
  const trendData = [...predictions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-8)
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      probability: item.probability,
      glucose: item.glucose,
      id: item.id
    }));

  const handleViewDetails = (record) => {
    setActivePrediction(record);
    navigate('/result');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Clinical Dashboard</h1>
          <p>
            Welcome back, <strong>{user ? user.name : 'Clinician'}</strong>. Real-time patient risk assessments &amp; cohort metrics.
          </p>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/predict')}
        >
          <PlusCircle size={18} />
          <span>New Risk Assessment</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <DashboardCard
          title="Total Predictions"
          value={total}
          subtitle="Cohort assessments"
          icon={Users}
          color="primary"
          trend="+12% this month"
          trendType="neutral"
          onClick={() => navigate('/history')}
        />
        <DashboardCard
          title="High Risk Cases"
          value={highRiskCount}
          subtitle={`${total > 0 ? Math.round((highRiskCount / total) * 100) : 0}% of cohort`}
          icon={AlertTriangle}
          color="high"
          trend="Flagged for review"
          trendType="negative"
          onClick={() => navigate('/history')}
        />
        <DashboardCard
          title="Moderate Risk"
          value={moderateRiskCount}
          subtitle="Borderline/Prediabetic"
          icon={Activity}
          color="mod"
          trend="Monitoring required"
          trendType="neutral"
          onClick={() => navigate('/history')}
        />
        <DashboardCard
          title="Low Risk / Healthy"
          value={lowRiskCount}
          subtitle={`${total > 0 ? Math.round((lowRiskCount / total) * 100) : 0}% within safe limits`}
          icon={CheckCircle2}
          color="low"
          trend="Optimal metabolic profile"
          trendType="positive"
          onClick={() => navigate('/history')}
        />
      </div>

      {/* Main Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Risk Distribution Donut Chart */}
        <ChartCard
          title="Risk Category Stratification"
          subtitle="Cohort breakdown across clinical vulnerability categories"
          icon={Activity}
          action={
            <Link to="/analytics" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              Full Analytics →
            </Link>
          }
        >
          <div style={{ width: '100%', height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [`${value} Patients`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Prediction Probability Trend Line/Area Chart */}
        <ChartCard
          title="Recent Assessment Risk Trajectory"
          subtitle="Estimated probability (%) across chronological evaluations"
          icon={TrendingUp}
          action={
            <span className="badge badge-info">
              Mean Risk: {avgRisk}%
            </span>
          }
        >
          <div style={{ width: '100%', height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  formatter={(value) => [`${value}% Risk`, 'Probability']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="probability"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section: Recent History & Clinician Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Recent History Table Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-header-title">
                <Calendar size={18} color="var(--primary)" />
                <span>Recent Clinical Predictions</span>
              </div>
              <div className="card-header-subtitle">Last 5 patient assessments performed</div>
            </div>
            <Link to="/history" className="btn btn-outline btn-sm">
              View All History
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Glucose</th>
                  <th>BMI</th>
                  <th>Risk Category</th>
                  <th>Probability</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 5).map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)', fontSize: '0.82rem' }}>
                        {record.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{record.patientName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                        {record.age} yrs • {record.gender}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{record.glucose}</span>{' '}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>mg/dL</span>
                    </td>
                    <td>
                      <span>{record.bmi}</span>{' '}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>kg/m²</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          record.riskCategory === 'High Risk'
                            ? 'badge-high'
                            : record.riskCategory === 'Moderate Risk'
                            ? 'badge-mod'
                            : 'badge-low'
                        }`}
                      >
                        {record.riskCategory}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{record.probability}%</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleViewDetails(record)}
                        title="View clinical breakdown"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User / Model Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div
                className="user-avatar-circle"
                style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}
              >
                {user ? user.name.charAt(0) : 'D'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user ? user.name : 'Dr. Alex Morgan'}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {user ? user.role : 'Clinical Researcher'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                <span style={{ fontWeight: 600 }}>{user?.department || 'Biomedical Informatics'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Institution:</span>
                <span style={{ fontWeight: 600 }}>{user?.institution || 'Health Sciences'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assessments Run:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{total} records</span>
              </div>
            </div>

            <Link
              to="/profile"
              className="btn btn-outline btn-sm"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Manage Profile Settings
            </Link>
          </div>

          {/* Quick AI Benchmark Banner */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              backgroundColor: '#f0fdf4',
              borderColor: '#bbf7d0',
              borderLeft: '4px solid var(--risk-low)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
              <Award size={18} />
              <span>Model Health Score: 87.2%</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#14532d', lineHeight: 1.45 }}>
              Ensemble classifier validated with 0.918 ROC-AUC. Suitable for research demonstration.
            </p>
          </div>
        </div>
      </div>

      {/* Quick View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Clinical Analysis - ${selectedRecord.id}`}
          maxWidth="550px"
          footer={
            <button className="btn btn-primary btn-sm" onClick={() => setSelectedRecord(null)}>
              Close Inspection
            </button>
          }
        >
          <RiskCard
            riskCategory={selectedRecord.riskCategory}
            probability={selectedRecord.probability}
            date={selectedRecord.date}
          />
        </Modal>
      )}
    </div>
  );
}
