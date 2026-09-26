import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  minHeight = '300px'
}) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-header-title">
            {Icon && <Icon size={18} color="var(--primary)" />}
            <span>{title}</span>
          </div>
          {subtitle && <div className="card-header-subtitle">{subtitle}</div>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="card-body" style={{ flex: 1, minHeight, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
