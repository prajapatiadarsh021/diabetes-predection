import React, { useState } from 'react';
import {
  HelpCircle,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Heart,
  Activity,
  User,
  Info
} from 'lucide-react';
import { CLINICAL_REFERENCE_RANGES, SAMPLE_PRESETS } from '../data/mockData';

export default function PredictionForm({ onSubmit, isLoading }) {
  const initialFormState = {
    patientName: '',
    age: '',
    gender: 'Female',
    pregnancies: '0',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    pedigree: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // If male is selected, default pregnancies to 0
      ...(name === 'gender' && value === 'Male' ? { pregnancies: '0' } : {})
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const applyPreset = (presetKey) => {
    const preset = SAMPLE_PRESETS[presetKey];
    if (preset) {
      setFormData({
        patientName: presetKey === 'lowRisk' ? 'Sample Low Risk' : presetKey === 'highRisk' ? 'Sample High Risk' : 'Sample Moderate Risk',
        age: String(preset.age),
        gender: preset.gender,
        pregnancies: String(preset.pregnancies),
        glucose: String(preset.glucose),
        bloodPressure: String(preset.bloodPressure),
        skinThickness: String(preset.skinThickness),
        insulin: String(preset.insulin),
        bmi: String(preset.bmi),
        pedigree: String(preset.pedigree)
      });
      setErrors({});
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Age must be between 1 and 120.';
    }

    if (formData.gender === 'Female') {
      if (formData.pregnancies === '' || Number(formData.pregnancies) < 0 || Number(formData.pregnancies) > 20) {
        newErrors.pregnancies = 'Enter valid number (0 - 20).';
      }
    }

    if (!formData.glucose || Number(formData.glucose) < 40 || Number(formData.glucose) > 300) {
      newErrors.glucose = 'Glucose must be between 40 and 300 mg/dL.';
    }

    if (!formData.bloodPressure || Number(formData.bloodPressure) < 30 || Number(formData.bloodPressure) > 160) {
      newErrors.bloodPressure = 'Blood pressure must be between 30 and 160 mm Hg.';
    }

    if (!formData.skinThickness || Number(formData.skinThickness) < 0 || Number(formData.skinThickness) > 99) {
      newErrors.skinThickness = 'Skin thickness must be between 0 and 99 mm.';
    }

    if (!formData.insulin || Number(formData.insulin) < 0 || Number(formData.insulin) > 900) {
      newErrors.insulin = 'Insulin must be between 0 and 900 µU/mL.';
    }

    if (!formData.bmi || Number(formData.bmi) < 10 || Number(formData.bmi) > 70) {
      newErrors.bmi = 'BMI must be between 10.0 and 70.0 kg/m².';
    }

    if (!formData.pedigree || Number(formData.pedigree) < 0.01 || Number(formData.pedigree) > 3.0) {
      newErrors.pedigree = 'Pedigree score must be between 0.05 and 2.50.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Quick Fill Presets for Presentation */}
      <div
        className="card"
        style={{
          marginBottom: '1.75rem',
          backgroundColor: '#f8fafc',
          borderColor: 'var(--primary-border)'
        }}
      >
        <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-hover)' }}>
            <Sparkles size={16} />
            <span>Demonstration Helper: Pre-fill Clinical Case</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => applyPreset('lowRisk')}
              style={{ backgroundColor: 'var(--risk-low-bg)', borderColor: 'var(--risk-low-border)', color: 'var(--risk-low-text)' }}
            >
              Case 1: Low Risk (Normal)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => applyPreset('moderateRisk')}
              style={{ backgroundColor: 'var(--risk-mod-bg)', borderColor: 'var(--risk-mod-border)', color: 'var(--risk-mod-text)' }}
            >
              Case 2: Borderline / Prediabetic
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => applyPreset('highRisk')}
              style={{ backgroundColor: 'var(--risk-high-bg)', borderColor: 'var(--risk-high-border)', color: 'var(--risk-high-text)' }}
            >
              Case 3: High Risk (Hyperglycemic)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Personal Information */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-header-title">
            <User size={18} color="var(--primary)" />
            <span>1. Personal & Demographic Information</span>
          </div>
          <span className="badge badge-info">Step 1 of 3</span>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="patientName">
                Patient Identifier / Name
                <span className="form-label-right">Optional</span>
              </label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                className="form-input"
                placeholder="e.g. Patient #4092 or Name"
                value={formData.patientName}
                onChange={handleChange}
              />
              <span className="form-hint">Used for reference and downloadable report headers</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="age">
                <span>Age *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">Age in completed years. Risk increases significantly past age 45.</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  className={`form-input has-unit ${errors.age ? 'error' : ''}`}
                  placeholder="e.g. 42"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">years</span>
              </div>
              {errors.age && <span className="form-error"><AlertCircle size={12} /> {errors.age}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gender">
                Biological Gender *
              </label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <span className="form-hint">Relevant for gestational history parameters</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pregnancies">
                <span>Number of Pregnancies</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">{CLINICAL_REFERENCE_RANGES.pregnancies.description}</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="pregnancies"
                  name="pregnancies"
                  type="number"
                  min="0"
                  max="20"
                  className={`form-input has-unit ${errors.pregnancies ? 'error' : ''}`}
                  placeholder="0"
                  value={formData.pregnancies}
                  onChange={handleChange}
                  disabled={formData.gender === 'Male'}
                />
                <span className="input-unit-tag">count</span>
              </div>
              {formData.gender === 'Male' && (
                <span className="form-hint" style={{ color: 'var(--text-light)' }}>Set to 0 for male patients</span>
              )}
              {errors.pregnancies && <span className="form-error"><AlertCircle size={12} /> {errors.pregnancies}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Physical Measurements */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-header-title">
            <Activity size={18} color="var(--teal)" />
            <span>2. Physical & Anthropometric Measurements</span>
          </div>
          <span className="badge badge-teal">Step 2 of 3</span>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="bmi">
                <span>Body Mass Index (BMI) *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">Normal: 18.5 - 24.9 | Overweight: 25 - 29.9 | Obese: ≥ 30</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="bmi"
                  name="bmi"
                  type="number"
                  step="0.1"
                  min="10"
                  max="70"
                  className={`form-input has-unit ${errors.bmi ? 'error' : ''}`}
                  placeholder="e.g. 26.5"
                  value={formData.bmi}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">kg/m²</span>
              </div>
              {errors.bmi && <span className="form-error"><AlertCircle size={12} /> {errors.bmi}</span>}
              <span className="form-hint">Weight in kilograms divided by height in meters squared</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skinThickness">
                <span>Triceps Skinfold Thickness *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">{CLINICAL_REFERENCE_RANGES.skinThickness.description} (Normal: 12-25 mm)</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="skinThickness"
                  name="skinThickness"
                  type="number"
                  min="0"
                  max="99"
                  className={`form-input has-unit ${errors.skinThickness ? 'error' : ''}`}
                  placeholder="e.g. 23"
                  value={formData.skinThickness}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">mm</span>
              </div>
              {errors.skinThickness && <span className="form-error"><AlertCircle size={12} /> {errors.skinThickness}</span>}
              <span className="form-hint">Standard caliper measurement on dominant arm</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Medical Biomarkers */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div className="card-header-title">
            <Heart size={18} color="var(--primary)" />
            <span>3. Clinical Laboratory Parameters</span>
          </div>
          <span className="badge badge-info">Step 3 of 3</span>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="glucose">
                <span>Fasting Blood Glucose *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">Normal: 70-99 mg/dL | Prediabetes: 100-125 | Diabetes: ≥126 mg/dL</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="glucose"
                  name="glucose"
                  type="number"
                  min="40"
                  max="300"
                  className={`form-input has-unit ${errors.glucose ? 'error' : ''}`}
                  placeholder="e.g. 105"
                  value={formData.glucose}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">mg/dL</span>
              </div>
              {errors.glucose && <span className="form-error"><AlertCircle size={12} /> {errors.glucose}</span>}
              <span className="form-hint">Plasma glucose level measured after minimum 8-hour fast</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bloodPressure">
                <span>Diastolic Blood Pressure *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">Normal: &lt;80 mm Hg | Elevated: 80-89 mm Hg | Stage 1: ≥90 mm Hg</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="bloodPressure"
                  name="bloodPressure"
                  type="number"
                  min="30"
                  max="160"
                  className={`form-input has-unit ${errors.bloodPressure ? 'error' : ''}`}
                  placeholder="e.g. 78"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">mm Hg</span>
              </div>
              {errors.bloodPressure && <span className="form-error"><AlertCircle size={12} /> {errors.bloodPressure}</span>}
              <span className="form-hint">Resting diastolic pressure (lower reading number)</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="insulin">
                <span>2-Hour Serum Insulin *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">Normal reference range: 16 - 166 µU/mL. Values &gt;166 suggest insulin resistance.</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="insulin"
                  name="insulin"
                  type="number"
                  min="0"
                  max="900"
                  className={`form-input has-unit ${errors.insulin ? 'error' : ''}`}
                  placeholder="e.g. 85"
                  value={formData.insulin}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">µU/mL</span>
              </div>
              {errors.insulin && <span className="form-error"><AlertCircle size={12} /> {errors.insulin}</span>}
              <span className="form-hint">Serum insulin concentration 2h post standard glucose challenge</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pedigree">
                <span>Diabetes Pedigree Function *</span>
                <span className="tooltip-container">
                  <HelpCircle size={14} className="tooltip-icon" />
                  <span className="tooltip-bubble">Genetic history score (0.05 to 2.50). Evaluates family history of diabetes.</span>
                </span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  id="pedigree"
                  name="pedigree"
                  type="number"
                  step="0.01"
                  min="0.05"
                  max="2.5"
                  className={`form-input has-unit ${errors.pedigree ? 'error' : ''}`}
                  placeholder="e.g. 0.45"
                  value={formData.pedigree}
                  onChange={handleChange}
                  required
                />
                <span className="input-unit-tag">score</span>
              </div>
              {errors.pedigree && <span className="form-error"><AlertCircle size={12} /> {errors.pedigree}</span>}
              <span className="form-hint">0.1 - 0.3 (Low family risk), 0.4 - 0.7 (Moderate), &gt;0.7 (Strong family history)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Alert */}
      <div className="disclaimer-banner" style={{ marginBottom: '1.75rem' }}>
        <Info size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Academic & Clinical Decision Support Notice:</strong> This software operates as an AI-powered statistical risk assessment tool. Results represent algorithmic probability estimates based on clinical research datasets and <u>do not</u> constitute a definitive medical diagnosis or treatment prescription.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          <RotateCcw size={16} />
          Reset Form
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
          style={{ minWidth: '180px' }}
        >
          <Sparkles size={18} />
          {isLoading ? 'Running AI Model...' : 'Predict Diabetes Risk'}
        </button>
      </div>
    </form>
  );
}
