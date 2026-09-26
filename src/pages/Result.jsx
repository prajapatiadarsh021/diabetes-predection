import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Printer,
  RotateCcw,
  History,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Heart,
  Activity,
  ArrowRight,
  TrendingUp,
  Apple,
  Dumbbell,
  Stethoscope,
  Share2
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { useToast } from '../context/ToastContext';
import { CLINICAL_REFERENCE_RANGES } from '../data/mockData';
import RiskCard from '../components/RiskCard';

export default function Result() {
  const navigate = useNavigate();
  const { activePrediction } = usePrediction();
  const { showToast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Report URL copied to clipboard', 'info');
  };

  if (!activePrediction) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <Activity size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No Active Prediction Found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Please submit patient health metrics in the assessment form or select a past record from the history.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/predict" className="btn btn-primary">
              Run New Prediction
            </Link>
            <Link to="/history" className="btn btn-outline">
              Browse History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const p = activePrediction;

  // Comparison metrics array for the clinical parameter breakdown
  const comparisonMetrics = [
    {
      label: 'Fasting Blood Glucose',
      value: `${p.glucose} mg/dL`,
      reference: CLINICAL_REFERENCE_RANGES.glucose.normal,
      status: p.glucose < 100 ? 'Normal' : p.glucose < 126 ? 'Borderline' : 'Elevated',
      statusType: p.glucose < 100 ? 'low' : p.glucose < 126 ? 'mod' : 'high'
    },
    {
      label: 'Body Mass Index (BMI)',
      value: `${p.bmi} kg/m²`,
      reference: CLINICAL_REFERENCE_RANGES.bmi.normal,
      status: p.bmi < 25 ? 'Normal' : p.bmi < 30 ? 'Overweight' : 'Obese',
      statusType: p.bmi < 25 ? 'low' : p.bmi < 30 ? 'mod' : 'high'
    },
    {
      label: 'Diastolic Blood Pressure',
      value: `${p.bloodPressure} mm Hg`,
      reference: CLINICAL_REFERENCE_RANGES.bloodPressure.normal,
      status: p.bloodPressure < 80 ? 'Optimal' : p.bloodPressure < 90 ? 'Borderline' : 'Stage 1 HTN',
      statusType: p.bloodPressure < 80 ? 'low' : p.bloodPressure < 90 ? 'mod' : 'high'
    },
    {
      label: 'Serum Insulin Level',
      value: `${p.insulin} µU/mL`,
      reference: CLINICAL_REFERENCE_RANGES.insulin.normal,
      status: p.insulin <= 166 ? 'Normal' : 'Elevated Resistance',
      statusType: p.insulin <= 166 ? 'low' : 'mod'
    },
    {
      label: 'Triceps Skinfold',
      value: `${p.skinThickness} mm`,
      reference: CLINICAL_REFERENCE_RANGES.skinThickness.normal,
      status: p.skinThickness <= 25 ? 'Normal' : 'High Adiposity',
      statusType: p.skinThickness <= 25 ? 'low' : 'mod'
    },
    {
      label: 'Diabetes Pedigree Score',
      value: `${p.pedigree}`,
      reference: '0.1 - 0.35 (Low)',
      status: p.pedigree < 0.35 ? 'Low Family History' : p.pedigree < 0.7 ? 'Moderate History' : 'High Genetic Risk',
      statusType: p.pedigree < 0.35 ? 'low' : p.pedigree < 0.7 ? 'mod' : 'high'
    },
    {
      label: 'Patient Age',
      value: `${p.age} years`,
      reference: '< 45 years',
      status: p.age < 45 ? 'Standard' : 'Elevated Risk Tier',
      statusType: p.age < 45 ? 'low' : 'mod'
    }
  ];

  return (
    <div>
      {/* Printable Formal Clinical Report Header (Visible only when printed) */}
      <div className="print-only-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#0284c7' }}>Smart Diabetes Risk Prediction System</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>AI Clinical Decision Support Laboratory Report</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
            <div><strong>Report ID:</strong> {p.id}</div>
            <div><strong>Evaluation Date:</strong> {new Date(p.date).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Screen Header */}
      <div className="page-header btn-no-print">
        <div className="page-title-group">
          <h1>Prediction Risk Assessment Report</h1>
          <p>
            Assessment Record ID: <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{p.id}</strong> • Evaluated on {new Date(p.date).toLocaleDateString()} at {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={handleCopyLink} title="Share link">
            <Share2 size={15} />
            <span>Share</span>
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={handlePrint} title="Print or save as PDF">
            <Printer size={15} />
            <span>Download / Print Report</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/predict')}>
            <RotateCcw size={15} />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* Critical Medical Disclaimer Banner */}
      <div
        className="card"
        style={{
          borderColor: 'var(--primary-border)',
          backgroundColor: '#f0f9ff',
          marginBottom: '1.75rem',
          padding: '1rem 1.25rem',
          borderLeft: '5px solid var(--primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Info size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 600 }}>
            “This result is an AI-based risk estimate and is not a medical diagnosis.”
          </div>
        </div>
      </div>

      {/* Top Section: Risk Card + Patient Profile Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}
      >
        <RiskCard
          riskCategory={p.riskCategory}
          probability={p.probability}
          date={p.date}
        />

        {/* Patient Parameters Overview Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">
              <Stethoscope size={18} color="var(--teal)" />
              <span>Patient Profile &amp; Subject Details</span>
            </div>
            <span className="badge badge-teal">Verified Input</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Patient Name</div>
                <div style={{ fontWeight: 600 }}>{p.patientName || 'Anonymous Case'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Biological Gender</div>
                <div style={{ fontWeight: 600 }}>{p.gender}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Patient Age</div>
                <div style={{ fontWeight: 600 }}>{p.age} years</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pregnancies</div>
                <div style={{ fontWeight: 600 }}>{p.pregnancies}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Fasting Blood Glucose</div>
                <div style={{ fontWeight: 600, color: p.glucose >= 126 ? 'var(--risk-high)' : 'inherit' }}>
                  {p.glucose} mg/dL
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Body Mass Index (BMI)</div>
                <div style={{ fontWeight: 600, color: p.bmi >= 30 ? 'var(--risk-high)' : 'inherit' }}>
                  {p.bmi} kg/m²
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contributing Factors Breakdown (Feature Attribution / Impact) */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">
              <TrendingUp size={18} color="var(--primary)" />
              <span>Key Contributing Risk Factors (Feature Impact)</span>
            </div>
            <div className="card-header-subtitle">
              Biomarkers that exerted the greatest mathematical weight on the model's classification
            </div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {p.primaryFactors && p.primaryFactors.length > 0 ? (
              p.primaryFactors.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: item.type === 'positive' ? 'var(--risk-low-bg)' : '#fef2f2',
                    border: `1px solid ${item.type === 'positive' ? 'var(--risk-low-border)' : '#fecaca'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {item.type === 'positive' ? (
                      <CheckCircle2 size={18} color="var(--risk-low)" />
                    ) : (
                      <AlertCircle size={18} color="var(--risk-high)" />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {item.factor}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.type === 'positive' ? 'Favorable biomarker lowering diabetes risk' : 'Clinical marker elevating statistical vulnerability'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${item.type === 'positive' ? 'badge-low' : 'badge-high'}`}
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                  >
                    {item.impact}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                All biomarkers evaluated within baseline expectations.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Reference Comparison Table */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">
              <Activity size={18} color="var(--teal)" />
              <span>Biomarker Comparison vs. Clinical Reference Thresholds</span>
            </div>
            <div className="card-header-subtitle">
              Standard clinical cut-offs based on American Diabetes Association (ADA) guidelines
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Biomarker Parameter</th>
                <th>Patient Reading</th>
                <th>Standard Reference Range</th>
                <th>Clinical Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{m.label}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: m.statusType === 'high' ? 'var(--risk-high)' : m.statusType === 'mod' ? 'var(--risk-mod)' : 'var(--text-main)' }}>
                      {m.value}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{m.reference}</td>
                  <td>
                    <span
                      className={`badge ${
                        m.statusType === 'high' ? 'badge-high' : m.statusType === 'mod' ? 'badge-mod' : 'badge-low'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* General Health & Lifestyle Guidance */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-header-title">
            <Heart size={18} color="var(--primary)" />
            <span>Tailored Health &amp; Preventative Recommendations</span>
          </div>
        </div>
        <div className="card-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div className="metric-icon-box" style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal)', flexShrink: 0 }}>
                <Apple size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>Nutrition Strategy</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Emphasize low glycemic-index carbohydrates, dietary fiber, whole legumes, and unrefined grains. Minimize free sugar intake.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div className="metric-icon-box" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <Dumbbell size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>Physical Activity</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Target at least 150 minutes of moderate aerobic conditioning per week alongside 2 sessions of progressive resistance training.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div className="metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#b45309', flexShrink: 0 }}>
                <Stethoscope size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>Clinical Supervision</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Consult a certified physician for formal confirmation tests (such as HbA1c or OGTT) before making medical decisions.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Model Recommended Action Items:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {p.recommendations && p.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation & Action Footer Buttons */}
      <div
        className="btn-no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <button className="btn btn-outline" onClick={() => navigate('/history')}>
          <History size={16} />
          <span>View Assessment History</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Download / Print Report</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/predict')}>
            <RotateCcw size={16} />
            <span>Conduct New Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
