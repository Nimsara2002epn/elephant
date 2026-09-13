import React from 'react';

export const PageHeader = ({ title, subtitle, action, breadcrumb }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        {breadcrumb && (
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '4px', fontWeight: 500 }}>
            {breadcrumb}
          </div>
        )}
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0D2A5B',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px', margin: 0, fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>

      {action && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{action}</div>}
    </div>
  );
};
