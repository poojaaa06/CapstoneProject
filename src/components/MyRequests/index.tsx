import React from 'react';
import { Card, Typography, Tag, Space, Button, List } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const requestData = [
  {
    key: '1',
    partName: 'Compressor',
    quantity: 2,
    status: 'Pending',
    requestedOn: '2025-04-28',
  },
  {
    key: '2',
    partName: 'Fan Blade',
    quantity: 1,
    status: 'Approved',
    requestedOn: '2025-04-25',
  },
  {
    key: '3',
    partName: 'Exhaust Nozzle',
    quantity: 3,
    status: 'Delivered',
    requestedOn: '2025-04-20',
  },
];

const statusColors: Record<string, string> = {
  Pending: 'orange',
  Approved: 'blue',
  Delivered: 'green',
};

const MyRequests: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <Title level={4} style={{marginTop:0}}>My Requests</Title>

      <List
        dataSource={requestData}
        renderItem={(item) => (
          <Card
            key={item.key}
            title={item.partName}
            style={{
              marginBottom: 16,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: 8,
              border: 'none',
            }}
            bodyStyle={{ padding: '16px' }}
            extra={
              <Tag
                icon={
                  item.status === 'Delivered' ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
                color={statusColors[item.status]}
              >
                {item.status}
              </Tag>
            }
          >
            <Space direction="vertical" size="small">
              <div><strong>Quantity:</strong> {item.quantity}</div>
              <div><strong>Requested On:</strong> {item.requestedOn}</div>
              <Button type="link" icon={<FileSearchOutlined />}>View Details</Button>
            </Space>
          </Card>
        )}
      />
    </div>
  );
};

export default MyRequests;
