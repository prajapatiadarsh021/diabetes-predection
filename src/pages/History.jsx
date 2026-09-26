import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  RotateCcw,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { useToast } from '../context/ToastContext';
import PredictionTable from '../components/PredictionTable';
import Modal from '../components/Modal';
import RiskCard from '../components/RiskCard';

export default function History() {
  const navigate = useNavigate();
  const { predictions, deletePrediction, setActivePrediction, resetPredictions } = usePrediction();
  const { showToast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSelectRecord = (record) => {
    setActivePrediction(record);
    navigate('/result');
  };

  const handleResetHistory = () => {
    if (window.confirm('Reset assessment history to initial baseline dataset?')) {
      resetPredictions();
      showToast('Assessment history reset to clinical demo baseline', 'info');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Prediction History &amp; Cohort Records</h1>
          <p>
            Browse, filter, search, and export past patient diabetes risk assessments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleResetHistory}
            title="Reload default sample cohort"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Baseline</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/predict')}
          >
            <PlusCircle size={15} />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <PredictionTable
        predictions={predictions}
        onSelectPrediction={handleSelectRecord}
        onDeletePrediction={deletePrediction}
      />

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Clinical Record Inspection: ${selectedRecord.id}`}
          maxWidth="620px"
          footer={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setActivePrediction(selectedRecord);
                  setSelectedRecord(null);
                  navigate('/result');
                }}
              >
                View Full Detailed Report
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
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
