// src/components/MetricCard/index.tsx
import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  accentColor: string;
  isMobile?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendLabel,
  icon,
  accentColor,
  isMobile = false,
}) => {
  const isPositive = trend >= 0;
  const absTrend = Math.abs(trend);

  return (
    <div className={`metric-card ${isMobile ? 'metric-card-mobile' : ''}`}>
      <div 
        className="metric-card__icon"
        style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
      >
        {icon}
      </div>
      <div className="metric-card__content">
        <div className="metric-card__title">{title}</div>
        <div className={`metric-card__value ${isMobile ? 'metric-card__value-mobile' : ''}`}>{value}</div>
        <div className={`metric-card__trend metric-card__trend--${isPositive ? 'up' : 'down'}`}>
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span>{absTrend}% {trendLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;