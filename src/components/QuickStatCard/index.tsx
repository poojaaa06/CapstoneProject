// src/components/QuickStatCard/index.tsx
import React from 'react';
import './QuickStatCard.css';

interface QuickStatCardProps {
  value: string;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isMobile?: boolean;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({
  value,
  label,
  sublabel,
  color,
  bgColor,
  borderColor,
  isMobile = false,
}) => {
  return (
    <div 
      className={`quick-stat-card ${isMobile ? 'quick-stat-card-mobile' : ''}`}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className={`quick-stat-card__value ${isMobile ? 'quick-stat-card__value-mobile' : ''}`} style={{ color }}>
        {value}
      </div>
      <div className="quick-stat-card__label">{label}</div>
      <div className="quick-stat-card__sublabel">{sublabel}</div>
    </div>
  );
};

export default QuickStatCard;