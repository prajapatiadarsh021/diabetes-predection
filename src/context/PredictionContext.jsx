import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getSavedPredictions,
  predictDiabetesRisk,
  deletePredictionRecord
} from '../services/predictionService';
import { INITIAL_PREDICTIONS } from '../data/mockData';

const PredictionContext = createContext(null);

export function PredictionProvider({ children }) {
  const [predictions, setPredictions] = useState(() => getSavedPredictions());
  const [activePrediction, setActivePrediction] = useState(() => {
    // Default to the most recent prediction
    const saved = getSavedPredictions();
    return saved.length > 0 ? saved[0] : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync state with storage
  useEffect(() => {
    const saved = getSavedPredictions();
    setPredictions(saved);
  }, []);

  const runPrediction = async (formData) => {
    setIsLoading(true);
    try {
      const result = await predictDiabetesRisk(formData);
      setPredictions((prev) => [result, ...prev]);
      setActivePrediction(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePrediction = (id) => {
    const updated = deletePredictionRecord(id);
    setPredictions(updated);
    if (activePrediction && activePrediction.id === id) {
      setActivePrediction(updated.length > 0 ? updated[0] : null);
    }
  };

  const selectPrediction = (id) => {
    const found = predictions.find((p) => p.id === id);
    if (found) {
      setActivePrediction(found);
    }
    return found;
  };

  const resetPredictions = () => {
    localStorage.setItem('smart_diabetes_predictions', JSON.stringify(INITIAL_PREDICTIONS));
    setPredictions(INITIAL_PREDICTIONS);
    setActivePrediction(INITIAL_PREDICTIONS[0]);
  };

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        activePrediction,
        isLoading,
        runPrediction,
        deletePrediction,
        selectPrediction,
        setActivePrediction,
        resetPredictions
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
}
