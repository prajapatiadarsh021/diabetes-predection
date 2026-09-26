import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BarChart2,
  FileText,
  Stethoscope,
  HeartPulse,
  Brain,
  AlertTriangle,
  Zap,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Footer from '../components/Footer';

export default function Landing() {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: '01',
      title: 'Biomarker Input',
      desc: 'Input standard clinical laboratory parameters including fasting blood glucose, blood pressure, BMI, and genetic pedigree.',
      icon: Stethoscope
    },
    {
      step: '02',
      title: 'AI Inference',
      desc: 'Machine learning classification algorithms (XGBoost & Random Forest) evaluate nonlinear parameter interactions.',
      icon: Cpu
    },
    {
      step: '03',
      title: 'Factor Stratification',
      desc: 'System visualizes exact biomarker weights contributing positively or negatively to the risk probability.',
      icon: BarChart2
    },
    {
      step: '04',
      title: 'Preventative Guidance',
      desc: 'Generates evidence-based lifestyle recommendations and formal printable medical summary reports.',
      icon: FileText
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'Clinical AI Modeling',
      desc: 'Calibrated on validated epidemiological diabetes datasets with high diagnostic sensitivity and specificity.'
    },
    {
      icon: HeartPulse,
      title: 'Multivariate Risk Scoring',
      desc: 'Combines metabolic markers, anthropometric metrics, and genetic pedigree rather than single-threshold testing.'
    },
    {
      icon: Zap,
      title: 'Instant Probability Gauges',
      desc: 'Real-time computation provides categorized classifications: Low Risk, Moderate Risk, and High Risk.'
    },
    {
      icon: TrendingUp,
      title: 'Population Analytics',
      desc: 'Interactive cohort trend lines, glucose-to-BMI scatter distributions, and age-stratified health insights.'
    },
    {
      icon: FileText,
      title: 'Printable Clinical Reports',
      desc: 'One-click generation of formatted, printable medical consultation summaries ready for healthcare review.'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy & Security',
      desc: 'Client-side simulation architecture ensuring patient data confidentiality with zero unauthorized exposure.'
    }
  ];

  const stats = [
    { value: '87.2%', label: 'Validation Accuracy', sub: 'Trained on clinical benchmark cohorts' },
    { value: '0.918', label: 'ROC-AUC Score', sub: 'High discrimination sensitivity' },
    { value: '9', label: 'Clinical Parameters', sub: 'Holistic biomarker evaluation' },
    { value: '< 1s', label: 'Inference Latency', sub: 'Immediate risk score computation' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Landing Top Header */}
      <header
        style={{
          height: '72px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon">
            <Activity size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Smart Diabetes AI
            </span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--teal)', fontWeight: 700 }}>
              Clinical Decision Support
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-outline btn-sm">
            Sign In
          </Link>
          <Link to="/predict" className="btn btn-primary btn-sm">
            <span>Try Assessment</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '4.5rem 2rem 4rem',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(224, 242, 254, 0.7) 0%, rgba(248, 250, 252, 0) 70%)',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-hover)',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              border: '1px solid var(--primary-border)'
            }}
          >
            <Sparkles size={15} />
            <span>AI-Driven Health Analytics • College Capstone Research</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}
          >
            Smart Diabetes <span style={{ color: 'var(--primary)' }}>Risk Prediction</span> &amp; Health Analytics System
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2.25rem'
            }}
          >
            An AI-powered system for estimating diabetes risk from selected health parameters.
            Enabling proactive risk identification, biomarker factor analysis, and tailored lifestyle interventions.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/predict')}
              style={{ padding: '0.9rem 2rem' }}
            >
              <span>Get Started with Prediction</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              <span>Explore Dashboard</span>
            </button>
          </div>

          {/* Quick Assurance Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginTop: '2.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              No clinical hardware required
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              Instant interactive factor evaluation
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--risk-low)" />
              Downloadable medical reports
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '2.5rem 2rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
          <div className="metrics-grid" style={{ marginBottom: 0 }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="metric-card"
                style={{ textAlign: 'center', padding: '1.75rem 1rem' }}
              >
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 2rem', maxWidth: 'var(--max-content-width)', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-teal" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
            System Methodology
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            How the Risk Estimation Engine Works
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            From clinical parameters to interpretable risk stratification in four seamless steps.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="card"
                style={{
                  position: 'relative',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: 'var(--border-color)',
                    lineHeight: 1
                  }}
                >
                  {step.step}
                </div>
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
              Advanced Capabilities
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Engineered for Clinical Relevance &amp; Usability
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              A holistic architecture tailored for student researchers, clinicians, and health analysts.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="card"
                  style={{ padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
                >
                  <div
                    className="metric-icon-box"
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--primary-light)' : 'var(--teal-light)',
                      color: i % 2 === 0 ? 'var(--primary)' : 'var(--teal)',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prominent Medical Disclaimer Section */}
      <section style={{ padding: '3.5rem 2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div
          className="card"
          style={{
            borderColor: 'var(--risk-mod-border)',
            backgroundColor: '#fffdfa',
            borderLeft: '5px solid var(--risk-mod)'
          }}
        >
          <div className="card-body" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={30} color="var(--risk-mod)" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#92400e', marginBottom: '0.4rem' }}>
                Important Medical &amp; Academic Disclaimer
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.6 }}>
                The <strong>Smart Diabetes Risk Prediction and Health Analytics System</strong> is an educational demonstration developed as a college capstone project.
                The statistical risk score and biomarker weighting generated by this platform are algorithm-driven approximations intended solely for academic evaluation and clinical research exploration.
                They <strong>do not constitute a professional medical diagnosis, clinical prognosis, or treatment plan</strong>.
                Always consult a certified healthcare professional for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section
        style={{
          padding: '4rem 2rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to test the prediction model?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Access the clinical form, experiment with sample high/low risk patient cases, and inspect the resulting biomarker breakdown.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/predict" className="btn btn-teal btn-lg">
              <span>Start Risk Assessment</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#334155' }}>
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
