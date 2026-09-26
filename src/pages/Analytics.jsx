import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  Cpu,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { usePrediction } from '../context/PredictionContext';
import { MODEL_PERFORMANCE_METRICS } from '../data/mockData';
import ChartCard from '../components/ChartCard';
import DashboardCard from '../components/DashboardCard';

export default function Analytics() {
  const { predictions } = usePrediction();

  // 1. Risk Distribution Data
  const riskDistData = useMemo(() => {
    const low = predictions.filter((p) => p.riskCategory === 'Low Risk').length;
    const mod = predictions.filter((p) => p.riskCategory === 'Moderate Risk').length;
    const high = predictions.filter((p) => p.riskCategory === 'High Risk').length;
    return [
      { name: 'Low Risk (<30%)', value: low, color: '#10b981' },
      { name: 'Moderate Risk (30-60%)', value: mod, color: '#f59e0b' },
      { name: 'High Risk (>60%)', value: high, color: '#ef4444' }
    ];
  }, [predictions]);

  // 2. Timeline Trend
  const timelineData = useMemo(() => {
    return [...predictions]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        probability: item.probability,
        glucose: item.glucose,
        bmi: item.bmi,
        id: item.id
      }));
  }, [predictions]);

  // 3. Age Group Stratification
  const ageGroupData = useMemo(() => {
    const groups = {
      '< 30': { group: '< 30', low: 0, moderate: 0, high: 0 },
      '30 - 39': { group: '30 - 39', low: 0, moderate: 0, high: 0 },
      '40 - 49': { group: '40 - 49', low: 0, moderate: 0, high: 0 },
      '50+': { group: '50+', low: 0, moderate: 0, high: 0 }
    };

    predictions.forEach((p) => {
      let g = '< 30';
      if (p.age >= 50) g = '50+';
      else if (p.age >= 40) g = '40 - 49';
      else if (p.age >= 30) g = '30 - 39';

      if (p.riskCategory === 'Low Risk') groups[g].low += 1;
      else if (p.riskCategory === 'Moderate Risk') groups[g].moderate += 1;
      else if (p.riskCategory === 'High Risk') groups[g].high += 1;
    });

    return Object.values(groups);
  }, [predictions]);

  // 4. Glucose vs. BMI Scatter Data
  const scatterData = useMemo(() => {
    return predictions.map((p) => ({
      glucose: p.glucose,
      bmi: p.bmi,
      probability: p.probability,
      name: p.patientName || p.id,
      risk: p.riskCategory
    }));
  }, [predictions]);

  const metrics = MODEL_PERFORMANCE_METRICS;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Population Health Analytics &amp; Model Insights</h1>
          <p>
            Statistical visualization of cohort risk factors and machine learning performance metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge badge-teal">
            <Cpu size={14} /> Model: {metrics.modelName}
          </span>
        </div>
      </div>

      {/* Model Performance Top Metrics */}
      <div className="metrics-grid">
        <DashboardCard
          title="Model Accuracy"
          value={`${metrics.accuracy}%`}
          subtitle="Cross-validated test score"
          icon={Award}
          color="teal"
          trend="Validated benchmark"
          trendType="positive"
        />
        <DashboardCard
          title="ROC-AUC Score"
          value={metrics.rocAuc}
          subtitle="Discrimination power (0 to 1)"
          icon={TrendingUp}
          color="primary"
          trend="Excellent class separation"
          trendType="positive"
        />
        <DashboardCard
          title="Sensitivity / Recall"
          value={`${metrics.recall}%`}
          subtitle="True positive identification"
          icon={Activity}
          color="mod"
          trend="Minimizes false negatives"
          trendType="neutral"
        />
        <DashboardCard
          title="Precision Score"
          value={`${metrics.precision}%`}
          subtitle="Positive predictive value"
          icon={CheckCircle2}
          color="low"
          trend="High confidence flag"
          trendType="positive"
        />
      </div>

      {/* Primary Analytics Charts Row 1 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Risk Category Donut Chart */}
        <ChartCard
          title="Cohort Risk Stratification"
          subtitle="Distribution of evaluated patients across risk categories"
          icon={PieChartIcon}
        >
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [`${value} Patients`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chronological Trajectory Line Chart */}
        <ChartCard
          title="Chronological Risk Trajectory"
          subtitle="Estimated diabetes risk probability (%) across timeline"
          icon={TrendingUp}
        >
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  formatter={(value) => [`${value}%`, 'Risk Probability']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0284c7' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Analytics Charts Row 2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Age-Group Stratification Bar Chart */}
        <ChartCard
          title="Risk Category by Age Demographics"
          subtitle="Comparing risk distribution across age categories"
          icon={Layers}
        >
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
                <Bar dataKey="low" name="Low Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="moderate" name="Moderate Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="high" name="High Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Glucose vs BMI Correlation Scatter Chart */}
        <ChartCard
          title="Fasting Glucose vs. Body Mass Index (BMI)"
          subtitle="Biomarker distribution mapping glycemic level against adiposity"
          icon={Activity}
        >
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="glucose"
                  name="Glucose"
                  unit=" mg/dL"
                  domain={[60, 200]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  type="number"
                  dataKey="bmi"
                  name="BMI"
                  unit=" kg/m²"
                  domain={[15, 45]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <ZAxis dataKey="probability" range={[50, 400]} name="Risk Probability" />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            padding: '0.65rem 0.85rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{data.name}</div>
                          <div>Glucose: {data.glucose} mg/dL</div>
                          <div>BMI: {data.bmi} kg/m²</div>
                          <div style={{ fontWeight: 600, color: data.probability >= 60 ? '#ef4444' : data.probability >= 30 ? '#f59e0b' : '#10b981' }}>
                            Risk: {data.probability}% ({data.risk})
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Patients" data={scatterData} fill="#0284c7" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Model Feature Importance & Technical Architecture */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Feature Importance Bars */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-header-title">
                <BarChart3 size={18} color="var(--primary)" />
                <span>Feature Importance Weights</span>
              </div>
              <div className="card-header-subtitle">Relative SHAP / Gini feature weights in the ensemble</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {metrics.featureImportance.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.importance}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.importance * 2.8}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confusion Matrix & Dataset Architecture */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-header-title">
                <Cpu size={18} color="var(--teal)" />
                <span>Model Evaluation &amp; Confusion Matrix</span>
              </div>
              <div className="card-header-subtitle">Clinical test set benchmark matrix (n=768)</div>
            </div>
          </div>
          <div className="card-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46' }}>
                  {metrics.confusionMatrix.trueNegative}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>True Negatives (TN)</div>
                <div style={{ fontSize: '0.7rem', color: '#065f46' }}>Correctly identified non-diabetic</div>
              </div>

              <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400e' }}>
                  {metrics.confusionMatrix.falsePositive}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>False Positives (FP)</div>
                <div style={{ fontSize: '0.7rem', color: '#92400e' }}>Type I Error</div>
              </div>

              <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991b1b' }}>
                  {metrics.confusionMatrix.falseNegative}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b91c1c' }}>False Negatives (FN)</div>
                <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>Type II Error (Minimizing is critical)</div>
              </div>

              <div style={{ padding: '1rem', background: '#e0f2fe', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1' }}>
                  {metrics.confusionMatrix.truePositive}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7' }}>True Positives (TP)</div>
                <div style={{ fontSize: '0.7rem', color: '#0369a1' }}>Correctly identified high risk</div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <strong>Evaluation Summary:</strong> The ensemble model utilizes weighted loss functions to prioritize sensitivity (recall = 83.9%), effectively limiting false negatives for timely early intervention.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
