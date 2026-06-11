// src/components/StatusBadge/index.tsx
import React from 'react';
import { Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './StatusBadge.css';

type RequestStatus = 'Pending' | 'Approved' | 'Delivered' | 'Rejected';

interface StatusBadgeProps {
  status: RequestStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    Pending: { color: 'orange', icon: <ClockCircleOutlined />, label: 'Pending' },
    Approved: { color: 'blue', icon: <CheckCircleOutlined />, label: 'Approved' },
    Delivered: { color: 'green', icon: <CheckCircleOutlined />, label: 'Delivered' },
    Rejected: { color: 'red', icon: <CloseCircleOutlined />, label: 'Rejected' },
  };

  const { color, icon, label } = config[status];

  return (
    <Tag color={color} icon={icon} className="status-badge" aria-label={`Status: ${label}`}>
      {label}
    </Tag>
  );
};

export default StatusBadge;