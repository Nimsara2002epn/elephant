import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorMap = {
    blue: { bg: '#E8F4FF', border: '#D0E8FF', text: '#2196F3', iconBg: '#E8F4FF' },
    green: { bg: '#DDF7EF', border: '#C0EFE0', text: '#0E8058', iconBg: '#DDF7EF' },
    cyan: { bg: '#DDF8F7', border: '#BCEEEB', text: '#088380', iconBg: '#DDF8F7' },
    amber: { bg: '#FFF8E6', border: '#FCE7B8', text: '#B45309', iconBg: '#FFF8E6' },
    red: { bg: '#FFE8F1', border: '#FFCCD8', text: '#D81E6B', iconBg: '#FFE8F1' },
    purple: { bg: '#EEE7FF', border: '#DDD0FF', text: '#6A38EB', iconBg: '#EEE7FF' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '22px',
        padding: '24px 26px',
        border: '1px solid #E2EAF3',
        boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06), 0 4px 6px -2px rgba(13, 42, 91, 0.02)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(33, 150, 243, 0.12), 0 6px 12px -3px rgba(13, 42, 91, 0.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(33, 150, 243, 0.06), 0 4px 6px -2px rgba(13, 42, 91, 0.02)';
      }}
    >
      <div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '6px' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0D2A5B', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px', display: 'block', fontWeight: 500 }}>
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: c.iconBg,
            color: c.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={26} />
        </div>
      )}
    </div>
  );
};
