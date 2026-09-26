import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { useToast } from '../context/ToastContext';
import PredictionForm from '../components/PredictionForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Prediction() {
  const navigate = useNavigate();
  const { runPrediction, isLoading } = usePrediction();
  const { showToast } = useToast();

  const handleFormSubmit = async (formData) => {
    try {
      const result = await runPrediction(formData);
      showToast(`Risk assessment generated: ${result.riskCategory} (${result.probability}%)`, 'success');
      navigate('/result');
    } catch (error) {
      showToast(error.message || 'Failed to process risk estimation.', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Diabetes Risk Prediction</h1>
          <p>
            Enter patient biometric and laboratory indicators to estimate statistical diabetes risk.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge badge-teal">
            <Activity size={14} /> Multivariate ML Engine
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <LoadingSpinner
            message="Evaluating Clinical Parameters..."
            subtext="Ensemble classification algorithms are mapping biomarkers against risk boundaries"
          />
        </div>
      ) : (
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <PredictionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
