import React from 'react';

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'positive', 'negative', 'neutral'
  color = 'primary', // 'primary', 'teal', 'low', 'mod', 'high'
  onClick
}) {
  const getColorStyles = () => {
    switch (color) {
      case 'low':
        return {
          iconBg: 'var(--risk-low-bg)',
          iconColor: 'var(--risk-low)',
          borderLeft: '4px solid var(--risk-low)'
        };
      case 'mod':
        return {
          iconBg: 'var(--risk-mod-bg)',
          iconColor: 'var(--risk-mod)',
          borderLeft: '4px solid var(--risk-mod)'
        };
      case 'high':
        return {
          iconBg: 'var(--risk-high-bg)',
          iconColor: 'var(--risk-high)',
          borderLeft: '4px solid var(--risk-high)'
        };
      case 'teal':
        return {
          iconBg: 'var(--teal-light)',
          iconColor: 'var(--teal)',
          borderLeft: '4px solid var(--teal)'
        };
      case 'primary':
      default:
        return {
          iconBg: 'var(--primary-light)',
          iconColor: 'var(--primary)',
          borderLeft: '4px solid var(--primary)'
        };
    }
  };

  const style = getColorStyles();

  return (
    <div
      className="metric-card"
      style={{ borderLeft: style.borderLeft, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="metric-card-top">
        <span className="metric-card-title">{title}</span>
        {Icon && (
          <div
            className="metric-icon-box"
            style={{ backgroundColor: style.iconBg, color: style.iconColor }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="metric-card-value">{value}</div>

      <div className="metric-card-subtext">
        {trend && (
          <span
            style={{
              fontWeight: 600,
              color:
                trendType === 'positive'
                  ? 'var(--risk-low)'
                  : trendType === 'negative'
                  ? 'var(--risk-high)'
                  : 'var(--text-muted)'
            }}
          >
            {trend}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
