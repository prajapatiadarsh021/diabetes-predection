import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu, Heart, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div className="logo-icon" style={{ width: '30px', height: '30px' }}>
              <Activity size={18} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Smart Diabetes Risk Prediction
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: '420px', marginBottom: '1rem' }}>
            An academic AI-assisted health analytics system leveraging machine learning classification
            algorithms to evaluate clinical metabolic biomarkers for early risk identification and preventive guidance.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600 }}>
            <GraduationCap size={16} />
            <span>Academic Capstone & Laboratory Research Project</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)', marginBottom: '1rem' }}>
            System Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <li><Link to="/dashboard">Clinical Dashboard</Link></li>
            <li><Link to="/predict">New Risk Assessment</Link></li>
            <li><Link to="/history">Prediction History</Link></li>
            <li><Link to="/analytics">Model Analytics & Metrics</Link></li>
            <li><Link to="/profile">Clinician Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)', marginBottom: '1rem' }}>
            AI Architecture
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={14} color="var(--primary)" /> XGBoost &amp; Random Forest Ensemble
            </li>
            <li>Dataset: Pima Indians Diabetes Benchmark</li>
            <li>Validation ROC-AUC: 0.918</li>
            <li>FastAPI-Ready REST API Architecture</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <ShieldAlert size={16} color="var(--risk-mod)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <strong>Medical Disclaimer:</strong> This system is strictly an academic demonstration and clinical decision support prototype. It is not intended for primary clinical diagnosis or disease management.
          </span>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
          © {new Date().getFullYear()} Smart Diabetes Risk Prediction System • College Capstone Project
        </div>
      </div>
    </footer>
  );
}
