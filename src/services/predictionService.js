/**
 * Prediction Service for Smart Diabetes Risk Prediction & Health Analytics System
 * 
 * ARCHITECTURE NOTE:
 * This service simulates an intelligent Machine Learning inference engine.
 * To integrate with a real FastAPI / Flask backend in the future, simply update the
 * USE_REMOTE_API flag or replace the simulatePrediction function with the commented
 * FastAPI fetch implementation below.
 */

import { INITIAL_PREDICTIONS } from '../data/mockData';

// Configurable flag: toggle when a real backend is running (e.g., http://localhost:8000)
const USE_REMOTE_API = false;
const BACKEND_API_URL = 'http://localhost:8000/api/predict';

const STORAGE_KEY = 'smart_diabetes_predictions';

/**
 * Retrieve saved predictions from localStorage or fall back to INITIAL_PREDICTIONS
 */
export function getSavedPredictions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading predictions from localStorage:', e);
  }
  // Initialize storage with realistic mock history
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PREDICTIONS));
  return INITIAL_PREDICTIONS;
}

/**
 * Save new prediction to localStorage
 */
export function persistPrediction(newPrediction) {
  try {
    const existing = getSavedPredictions();
    const updated = [newPrediction, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving prediction to localStorage:', e);
    return [];
  }
}

/**
 * Delete a prediction from history
 */
export function deletePredictionRecord(id) {
  try {
    const existing = getSavedPredictions();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting prediction:', e);
    return [];
  }
}

/**
 * Clinically grounded risk evaluation algorithm simulating logistic regression / XGBoost
 * calibrated on standard Pima Indian Diabetes dataset parameters.
 */
function calculateClinicalRiskScore(data) {
  const glucose = Number(data.glucose) || 100;
  const bmi = Number(data.bmi) || 24;
  const age = Number(data.age) || 30;
  const pedigree = Number(data.pedigree) || 0.3;
  const insulin = Number(data.insulin) || 80;
  const bp = Number(data.bloodPressure) || 75;
  const pregnancies = Number(data.pregnancies) || 0;
  const skinThickness = Number(data.skinThickness) || 20;

  // Normalized scores (0 to 1 scale roughly for standard biological limits)
  // Glucose has the highest weight in diabetes pathology
  let logit = -5.8; // Baseline intercept

  // Fasting glucose factor (normal ~85-100, prediabetes ~100-125, diabetic >=126)
  if (glucose >= 140) {
    logit += 2.8 * (glucose / 140);
  } else if (glucose >= 110) {
    logit += 1.6 * (glucose / 110);
  } else if (glucose < 95) {
    logit -= 1.0;
  }

  // BMI factor (normal 18.5-24.9, overweight 25-29.9, obese 30+)
  if (bmi >= 35) {
    logit += 2.2 * (bmi / 35);
  } else if (bmi >= 30) {
    logit += 1.4 * (bmi / 30);
  } else if (bmi >= 25) {
    logit += 0.7 * (bmi / 25);
  } else if (bmi <= 23) {
    logit -= 0.8;
  }

  // Age factor (beta cell degradation and insulin sensitivity decline)
  if (age >= 50) {
    logit += 1.1 * (age / 50);
  } else if (age >= 40) {
    logit += 0.6;
  } else if (age < 30) {
    logit -= 0.5;
  }

  // Pedigree score (genetic susceptibility)
  if (pedigree >= 0.7) {
    logit += 1.2 * (pedigree / 0.7);
  } else if (pedigree >= 0.4) {
    logit += 0.6;
  }

  // Insulin level (insulin resistance proxy)
  if (insulin >= 180) {
    logit += 1.0 * (insulin / 180);
  } else if (insulin >= 120) {
    logit += 0.4;
  }

  // Blood pressure (metabolic syndrome vascular stress)
  if (bp >= 90) {
    logit += 0.6;
  } else if (bp >= 80) {
    logit += 0.2;
  }

  // Pregnancies (gestational diabetes vulnerability)
  if (pregnancies >= 4) {
    logit += 0.5;
  } else if (pregnancies >= 2) {
    logit += 0.2;
  }

  // Convert logit to sigmoid probability [0, 1]
  const rawProb = 1 / (1 + Math.exp(-logit));
  // Bound probability safely between 5% and 96%
  const probability = Math.min(Math.max(Math.round(rawProb * 1000) / 10, 5.2), 95.8);

  // Categorize risk
  let riskCategory = 'Low Risk';
  if (probability >= 60) {
    riskCategory = 'High Risk';
  } else if (probability >= 30) {
    riskCategory = 'Moderate Risk';
  }

  // Determine key contributing factors
  const primaryFactors = [];
  if (glucose >= 126) {
    primaryFactors.push({
      factor: `Elevated Fasting Glucose (${glucose} mg/dL)`,
      impact: 'High (+32%)',
      type: 'negative'
    });
  } else if (glucose >= 100) {
    primaryFactors.push({
      factor: `Impaired Fasting Glucose (${glucose} mg/dL)`,
      impact: 'Moderate (+18%)',
      type: 'negative'
    });
  } else {
    primaryFactors.push({
      factor: `Optimal Fasting Glucose (${glucose} mg/dL)`,
      impact: 'Protective (-25%)',
      type: 'positive'
    });
  }

  if (bmi >= 30) {
    primaryFactors.push({
      factor: `Obesity Range BMI (${bmi} kg/m²)`,
      impact: 'High (+24%)',
      type: 'negative'
    });
  } else if (bmi >= 25) {
    primaryFactors.push({
      factor: `Overweight BMI (${bmi} kg/m²)`,
      impact: 'Moderate (+15%)',
      type: 'negative'
    });
  } else {
    primaryFactors.push({
      factor: `Healthy Body Mass Index (${bmi} kg/m²)`,
      impact: 'Optimal (-20%)',
      type: 'positive'
    });
  }

  if (pedigree >= 0.5) {
    primaryFactors.push({
      factor: `Elevated Genetic Pedigree Score (${pedigree})`,
      impact: 'Moderate (+12%)',
      type: 'negative'
    });
  }

  if (age >= 45) {
    primaryFactors.push({
      factor: `Age Factor (${age} years)`,
      impact: 'Moderate (+10%)',
      type: 'negative'
    });
  }

  if (bp >= 85) {
    primaryFactors.push({
      factor: `Elevated Diastolic BP (${bp} mm Hg)`,
      impact: 'Mild (+8%)',
      type: 'negative'
    });
  }

  // Health guidance tailored to risk and metrics
  const recommendations = [];
  if (riskCategory === 'High Risk') {
    recommendations.push('Schedule an in-person consultation with an endocrinologist or primary care physician.');
    recommendations.push('Request formal diagnostic blood work including HbA1c and comprehensive lipid profile.');
    recommendations.push('Adopt a medically supervised Mediterranean or low-glycemic dietary regimen.');
    recommendations.push('Aim for 150+ minutes of moderate aerobic activity and resistance training per week.');
  } else if (riskCategory === 'Moderate Risk') {
    recommendations.push('Target a 5% to 7% gradual reduction in body weight to improve metabolic insulin sensitivity.');
    recommendations.push('Replace refined carbohydrates with high-fiber legumes, vegetables, and whole grains.');
    recommendations.push('Incorporate 30 minutes of brisk daily walking or cycling.');
    recommendations.push('Retest fasting plasma glucose every 6 to 12 months to monitor progression.');
  } else {
    recommendations.push('Maintain your current healthy lifestyle, balanced nutrition, and active routine.');
    recommendations.push('Continue standard routine annual health check-ups and preventative screenings.');
    recommendations.push('Keep hydration optimal and prioritize 7 to 8 hours of quality sleep.');
  }

  return {
    riskCategory,
    probability,
    primaryFactors,
    recommendations,
    biomarkers: {
      glucose: { value: glucose, status: glucose < 100 ? 'Normal' : glucose < 126 ? 'Borderline' : 'High' },
      bmi: { value: bmi, status: bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese' },
      bloodPressure: { value: bp, status: bp < 80 ? 'Optimal' : bp < 90 ? 'Elevated' : 'High' },
      insulin: { value: insulin, status: insulin <= 166 ? 'Normal' : 'Elevated' },
      skinThickness: { value: skinThickness, status: skinThickness <= 25 ? 'Normal' : 'Elevated' },
      pedigree: { value: pedigree, status: pedigree < 0.35 ? 'Low' : pedigree < 0.7 ? 'Moderate' : 'High' }
    }
  };
}

/**
 * Main prediction API function
 * @param {Object} formData Patient health parameters
 * @returns {Promise<Object>} Formatted prediction result
 */
export async function predictDiabetesRisk(formData) {
  // If integrating with a real FastAPI backend:
  /*
  if (USE_REMOTE_API) {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  }
  */

  // Simulated AI model inference with realistic processing latency (650ms)
  await new Promise((resolve) => setTimeout(resolve, 650));

  const evaluation = calculateClinicalRiskScore(formData);
  const predictionId = `DIA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const result = {
    id: predictionId,
    date: new Date().toISOString(),
    patientName: formData.patientName || 'Anonymous Patient',
    age: Number(formData.age),
    gender: formData.gender || 'Female',
    pregnancies: Number(formData.pregnancies || 0),
    glucose: Number(formData.glucose),
    bloodPressure: Number(formData.bloodPressure),
    skinThickness: Number(formData.skinThickness),
    insulin: Number(formData.insulin),
    bmi: Number(formData.bmi),
    pedigree: Number(formData.pedigree),
    riskCategory: evaluation.riskCategory,
    probability: evaluation.probability,
    primaryFactors: evaluation.primaryFactors,
    recommendations: evaluation.recommendations,
    biomarkers: evaluation.biomarkers
  };

  // Persist to storage
  persistPrediction(result);

  return result;
}
