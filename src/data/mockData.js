/**
 * Mock Data for Smart Diabetes Risk Prediction & Health Analytics System
 * Based on standardized clinical benchmarks (Pima Indians Diabetes reference metrics).
 */

export const CLINICAL_REFERENCE_RANGES = {
  glucose: {
    name: 'Fasting Glucose',
    unit: 'mg/dL',
    min: 50,
    max: 250,
    normal: '70 - 99 mg/dL',
    prediabetic: '100 - 125 mg/dL',
    high: '≥ 126 mg/dL',
    description: 'Blood sugar level after an overnight fast. Primary biomarker for glycemic control.'
  },
  bloodPressure: {
    name: 'Blood Pressure (Diastolic)',
    unit: 'mm Hg',
    min: 40,
    max: 130,
    normal: '< 80 mm Hg',
    elevated: '80 - 89 mm Hg',
    high: '≥ 90 mm Hg (Hypertension)',
    description: 'Diastolic arterial pressure in resting phase. Correlates with vascular stress.'
  },
  bmi: {
    name: 'Body Mass Index (BMI)',
    unit: 'kg/m²',
    min: 12,
    max: 60,
    normal: '18.5 - 24.9',
    overweight: '25.0 - 29.9',
    obese: '≥ 30.0',
    description: 'Ratio of weight to height squared. Key indicator of body adiposity and metabolic syndrome.'
  },
  insulin: {
    name: '2-Hour Serum Insulin',
    unit: 'µU/mL',
    min: 0,
    max: 400,
    normal: '16 - 166 µU/mL',
    elevated: '> 166 µU/mL (Insulin Resistance)',
    description: 'Serum insulin level 2 hours post-oral glucose tolerance test (OGTT).'
  },
  skinThickness: {
    name: 'Triceps Skinfold Thickness',
    unit: 'mm',
    min: 5,
    max: 70,
    normal: '12 - 25 mm',
    high: '> 25 mm',
    description: 'Indirect anthropometric measure of subcutaneous adipose tissue reserves.'
  },
  pedigree: {
    name: 'Diabetes Pedigree Function',
    unit: 'score (0.0 - 2.5)',
    min: 0.05,
    max: 2.5,
    low: '< 0.35',
    moderate: '0.35 - 0.70',
    high: '> 0.70 (Strong Family History)',
    description: 'Genetic score synthesizing diabetic history among 1st and 2nd-degree biological relatives.'
  },
  pregnancies: {
    name: 'Pregnancies',
    unit: 'count',
    min: 0,
    max: 17,
    description: 'History of full-term pregnancies. Multiple gestations can increase gestational metabolic strain.'
  },
  age: {
    name: 'Patient Age',
    unit: 'years',
    min: 18,
    max: 100,
    riskZone: '≥ 45 years',
    description: 'Age-dependent decline in beta-cell insulin secretion and peripheral insulin sensitivity.'
  }
};

export const INITIAL_PREDICTIONS = [
  {
    id: 'DIA-2026-8812',
    date: '2026-03-18T10:30:00Z',
    patientName: 'Sarah Jenkins',
    age: 48,
    gender: 'Female',
    pregnancies: 3,
    glucose: 148,
    bloodPressure: 84,
    skinThickness: 32,
    insulin: 178,
    bmi: 33.6,
    pedigree: 0.627,
    riskCategory: 'High Risk',
    probability: 78.4,
    primaryFactors: [
      { factor: 'Fasting Blood Glucose (148 mg/dL)', impact: 'High (+32%)', type: 'negative' },
      { factor: 'Elevated BMI (33.6 kg/m² - Obese Class I)', impact: 'High (+24%)', type: 'negative' },
      { factor: 'Elevated Serum Insulin (178 µU/mL)', impact: 'Moderate (+14%)', type: 'negative' },
      { factor: 'Age & Family Pedigree Score', impact: 'Moderate (+8%)', type: 'negative' }
    ],
    recommendations: [
      'Schedule a formal HbA1c diagnostic confirmation with your primary physician.',
      'Adopt a medical nutrition therapy plan focusing on low glycemic index foods.',
      'Engage in 150 minutes of moderate-intensity aerobic exercise weekly.',
      'Monitor resting blood pressure and lipid profile bi-monthly.'
    ]
  },
  {
    id: 'DIA-2026-8811',
    date: '2026-03-17T14:15:00Z',
    patientName: 'David Chen',
    age: 29,
    gender: 'Male',
    pregnancies: 0,
    glucose: 88,
    bloodPressure: 72,
    skinThickness: 19,
    insulin: 54,
    bmi: 22.4,
    pedigree: 0.231,
    riskCategory: 'Low Risk',
    probability: 12.2,
    primaryFactors: [
      { factor: 'Optimal Fasting Glucose (88 mg/dL)', impact: 'Optimal (-28%)', type: 'positive' },
      { factor: 'Healthy BMI (22.4 kg/m²)', impact: 'Optimal (-22%)', type: 'positive' },
      { factor: 'Normal Serum Insulin & BP', impact: 'Optimal (-15%)', type: 'positive' }
    ],
    recommendations: [
      'Maintain balanced whole-food dietary habits and consistent physical activity.',
      'Routine annual screening recommended to monitor metabolic homeostasis.'
    ]
  },
  {
    id: 'DIA-2026-8810',
    date: '2026-03-16T09:45:00Z',
    patientName: 'Elena Rostova',
    age: 42,
    gender: 'Female',
    pregnancies: 2,
    glucose: 118,
    bloodPressure: 80,
    skinThickness: 28,
    insulin: 110,
    bmi: 28.1,
    pedigree: 0.485,
    riskCategory: 'Moderate Risk',
    probability: 44.8,
    primaryFactors: [
      { factor: 'Prediabetic Glucose Zone (118 mg/dL)', impact: 'Moderate (+22%)', type: 'negative' },
      { factor: 'Overweight BMI (28.1 kg/m²)', impact: 'Moderate (+16%)', type: 'negative' },
      { factor: 'Family History Score (0.485)', impact: 'Mild (+6%)', type: 'negative' }
    ],
    recommendations: [
      'Target a modest 5-7% body weight reduction over 3 to 6 months.',
      'Limit refined sugars, sugar-sweetened beverages, and ultra-processed starches.',
      'Repeat fasting blood glucose and OGTT test in 6 months.'
    ]
  },
  {
    id: 'DIA-2026-8809',
    date: '2026-03-14T11:20:00Z',
    patientName: 'Marcus Vance',
    age: 56,
    gender: 'Male',
    pregnancies: 0,
    glucose: 165,
    bloodPressure: 92,
    skinThickness: 35,
    insulin: 210,
    bmi: 36.2,
    pedigree: 0.812,
    riskCategory: 'High Risk',
    probability: 88.6,
    primaryFactors: [
      { factor: 'Severe Hyperglycemia (165 mg/dL)', impact: 'Critical (+38%)', type: 'negative' },
      { factor: 'Severe Obesity (BMI 36.2 kg/m²)', impact: 'High (+26%)', type: 'negative' },
      { factor: 'Strong Genetic Pedigree (0.812)', impact: 'High (+16%)', type: 'negative' },
      { factor: 'Stage 1 Hypertension (92 mm Hg)', impact: 'Moderate (+8%)', type: 'negative' }
    ],
    recommendations: [
      'Prompt clinical consultation with an endocrinologist is strongly indicated.',
      'Comprehensive metabolic panel including HbA1c, microalbuminuria, and lipid panel.',
      'Implement blood glucose self-monitoring and structured nutritional counselling.'
    ]
  },
  {
    id: 'DIA-2026-8808',
    date: '2026-03-12T16:50:00Z',
    patientName: 'Amina Patel',
    age: 33,
    gender: 'Female',
    pregnancies: 1,
    glucose: 94,
    bloodPressure: 74,
    skinThickness: 22,
    insulin: 68,
    bmi: 23.8,
    pedigree: 0.198,
    riskCategory: 'Low Risk',
    probability: 14.5,
    primaryFactors: [
      { factor: 'Normal Glycemic Status (94 mg/dL)', impact: 'Optimal (-25%)', type: 'positive' },
      { factor: 'Normal Weight Range (23.8 kg/m²)', impact: 'Optimal (-20%)', type: 'positive' },
      { factor: 'Low Genetic Pedigree Score', impact: 'Favorable (-12%)', type: 'positive' }
    ],
    recommendations: [
      'Excellent cardiovascular and metabolic profile. Continue active lifestyle and balanced diet.'
    ]
  },
  {
    id: 'DIA-2026-8807',
    date: '2026-03-10T13:10:00Z',
    patientName: 'Carlos Gomez',
    age: 51,
    gender: 'Male',
    pregnancies: 0,
    glucose: 124,
    bloodPressure: 86,
    skinThickness: 29,
    insulin: 135,
    bmi: 29.4,
    pedigree: 0.540,
    riskCategory: 'Moderate Risk',
    probability: 52.1,
    primaryFactors: [
      { factor: 'Impaired Fasting Glucose (124 mg/dL)', impact: 'Moderate (+25%)', type: 'negative' },
      { factor: 'Overweight BMI (29.4 kg/m²)', impact: 'Moderate (+15%)', type: 'negative' },
      { factor: 'Elevated Diastolic BP (86 mm Hg)', impact: 'Mild (+12%)', type: 'negative' }
    ],
    recommendations: [
      'Lifestyle intervention program targeting caloric reduction and increased physical activity.',
      'Consult physician regarding prediabetes management and metabolic tracking.'
    ]
  },
  {
    id: 'DIA-2026-8806',
    date: '2026-03-08T08:30:00Z',
    patientName: 'Rachel Green',
    age: 24,
    gender: 'Female',
    pregnancies: 0,
    glucose: 82,
    bloodPressure: 68,
    skinThickness: 18,
    insulin: 45,
    bmi: 21.0,
    pedigree: 0.165,
    riskCategory: 'Low Risk',
    probability: 8.9,
    primaryFactors: [
      { factor: 'Optimal Glucose & Insulin', impact: 'Optimal (-30%)', type: 'positive' },
      { factor: 'Healthy BMI & Blood Pressure', impact: 'Optimal (-25%)', type: 'positive' }
    ],
    recommendations: [
      'Maintain healthy hydration, regular physical activity, and nutrient-dense whole foods.'
    ]
  },
  {
    id: 'DIA-2026-8805',
    date: '2026-03-05T15:40:00Z',
    patientName: 'Robert Johnson',
    age: 62,
    gender: 'Male',
    pregnancies: 0,
    glucose: 155,
    bloodPressure: 88,
    skinThickness: 31,
    insulin: 190,
    bmi: 34.1,
    pedigree: 0.742,
    riskCategory: 'High Risk',
    probability: 83.2,
    primaryFactors: [
      { factor: 'Elevated Glucose (155 mg/dL)', impact: 'High (+34%)', type: 'negative' },
      { factor: 'Class I Obesity (34.1 kg/m²)', impact: 'High (+25%)', type: 'negative' },
      { factor: 'Advanced Age (62 yrs)', impact: 'Moderate (+14%)', type: 'negative' },
      { factor: 'High Pedigree Score (0.742)', impact: 'Moderate (+10%)', type: 'negative' }
    ],
    recommendations: [
      'Immediate clinical follow-up for diabetes diagnostic workup.',
      'Cardiovascular risk stratification and kidney function screening.'
    ]
  }
];

export const MODEL_PERFORMANCE_METRICS = {
  modelName: 'XGBoost & Random Forest Ensemble',
  trainingDataset: 'Pima Indians & NHANES Clinical Cohort (n=768 / 1,200 validated)',
  accuracy: 87.2,
  precision: 85.4,
  recall: 83.9,
  f1Score: 84.6,
  rocAuc: 0.918,
  confusionMatrix: {
    trueNegative: 452,
    falsePositive: 48,
    falseNegative: 50,
    truePositive: 218
  },
  featureImportance: [
    { name: 'Fasting Glucose', importance: 34.2, color: '#0284c7' },
    { name: 'BMI (Body Mass Index)', importance: 23.5, color: '#0d9488' },
    { name: 'Age', importance: 14.1, color: '#0ea5e9' },
    { name: 'Diabetes Pedigree Function', importance: 11.8, color: '#14b8a6' },
    { name: 'Serum Insulin', importance: 8.4, color: '#38bdf8' },
    { name: 'Blood Pressure', importance: 4.8, color: '#2dd4bf' },
    { name: 'Pregnancies', importance: 2.2, color: '#7dd3fc' },
    { name: 'Skin Thickness', importance: 1.0, color: '#99f6e4' }
  ]
};

export const SAMPLE_PRESETS = {
  lowRisk: {
    age: 26,
    gender: 'Female',
    pregnancies: 0,
    glucose: 85,
    bloodPressure: 70,
    skinThickness: 18,
    insulin: 45,
    bmi: 21.5,
    pedigree: 0.21
  },
  moderateRisk: {
    age: 44,
    gender: 'Female',
    pregnancies: 2,
    glucose: 115,
    bloodPressure: 82,
    skinThickness: 27,
    insulin: 115,
    bmi: 27.8,
    pedigree: 0.48
  },
  highRisk: {
    age: 52,
    gender: 'Female',
    pregnancies: 4,
    glucose: 158,
    bloodPressure: 88,
    skinThickness: 34,
    insulin: 195,
    bmi: 35.2,
    pedigree: 0.78
  }
};

export const INITIAL_USER = {
  name: 'Dr. Alex Morgan',
  email: 'alex.morgan@healthai.edu',
  role: 'Research Clinician / Student Analyst',
  age: 34,
  gender: 'Female',
  department: 'Biomedical Informatics & Data Science',
  institution: 'University Health Sciences Institute',
  joinedDate: 'September 2025'
};
