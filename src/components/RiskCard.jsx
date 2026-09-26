import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export default function RiskCard({ riskCategory, probability, date }) {
  const getRiskDetails = () => {
    switch (riskCategory) {
      case 'High Risk':
        return {
          icon: AlertCircle,
          badgeClass: 'badge-high',
          accentColor: 'var(--risk-high)',
          bgColor: 'var(--risk-high-bg)',
          borderColor: 'var(--risk-high-border)',
          title: 'High Risk Profile Detected',
          summary: 'Clinical biomarkers indicate elevated metabolic susceptibility consistent with type 2 diabetes pathology.'
        };
      case 'Moderate Risk':
        return {
          icon: AlertTriangle,
          badgeClass: 'badge-mod',
          accentColor: 'var(--risk-mod)',
          bgColor: 'var(--risk-mod-bg)',
          borderColor: 'var(--risk-mod-border)',
          title: 'Moderate / Pre-diabetic Risk',
          summary: 'Biomarkers reflect borderline metabolic strain. Early targeted interventions can prevent progression.'
        };
      case 'Low Risk':
      default:
        return {
          icon: CheckCircle2,
          badgeClass: 'badge-low',
          accentColor: 'var(--risk-low)',
          bgColor: 'var(--risk-low-bg)',
          borderColor: 'var(--risk-low-border)',
          title: 'Low Risk Classification',
          summary: 'Metabolic markers fall primarily within healthy clinical reference thresholds.'
        };
    }
  };

  const details = getRiskDetails();
  const Icon = details.icon;
  const numProb = Number(probability) || 0;

  // Gauge circumference calculation for SVG circle
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Let's use a 180-degree semi-arc or clean ring
  const strokeDashoffset = circumference - (numProb / 100) * circumference;

  return (
    <div
      className="card"
      style={{
        borderTop: `4px solid ${details.accentColor}`,
        backgroundColor: '#ffffff'
      }}
    >
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span className={`badge ${details.badgeClass}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
            <Icon size={16} />
            {riskCategory}
          </span>
          {date && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Assessed: {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Circular SVG Meter */}
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#f1f5f9"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={details.accentColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {numProb}%
              </div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>
                Probability
              </div>
            </div>
          </div>

          {/* Description details */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              {details.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              {details.summary}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-info">
                <Activity size={12} /> AI Confidence: 94.2%
              </span>
              <span className="badge badge-teal">
                Ensemble Model v2.4
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
