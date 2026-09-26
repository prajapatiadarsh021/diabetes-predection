import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export default function LoadingSpinner({
  message = 'Processing health metrics with AI model...',
  subtext = 'Please wait while clinical biomarkers are evaluated'
}) {
  const steps = [
    'Normalizing patient health metrics against baseline cohorts...',
    'Evaluating ensemble decision boundaries (XGBoost + Random Forest)...',
    'Computing biomarker factor impact weights...',
    'Synthesizing personalized risk stratification...'
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 400);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="loading-overlay">
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-ring"></div>
        <div style={{ position: 'absolute', color: 'var(--primary)' }}>
          <Cpu size={20} />
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          {message}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 500, minHeight: '1.4em' }}>
          {steps[currentStep]}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          <ShieldCheck size={14} color="var(--teal)" />
          <span>Local client-side simulation • HIPAA/GDPR mock compliant</span>
        </div>
      </div>
    </div>
  );
}
