import React, { useState } from "react";
import { Card, Tag, Typography, Select, Row, Col, Space } from "antd";

const { Title } = Typography;
const { Option } = Select;

type MaintenanceOrder = {
  id: string;
  asset: string;
  part: string;
  issue: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Completed";
};

const mockOrders: MaintenanceOrder[] = [
  {
    id: "ORD-001",
    asset: "Engine A",
    part: "Fan Blade",
    issue: "Crack on surface",
    priority: "High",
    status: "Open",
  },
  {
    id: "ORD-002",
    asset: "Pump B",
    part: "Valve",
    issue: "Leakage",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "ORD-003",
    asset: "Motor C",
    part: "Housing Cover",
    issue: "Loose screws",
    priority: "Low",
    status: "Completed",
  },
];

const MaintenanceOrders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const filteredOrders = statusFilter
    ? mockOrders.filter((order) => order.status === statusFilter)
    : mockOrders;

  const getPriorityTag = (priority: string) => {
    const color =
      priority === "High" ? "red" : priority === "Medium" ? "orange" : "green";
    return <Tag color={color}>{priority}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const color =
      status === "Open"
        ? "volcano"
        : status === "In Progress"
        ? "blue"
        : "green";
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Maintenance Orders</Title>
      <Space style={{ marginBottom: 16 }}>
        <span>Filter by Status:</span>
        <Select
          placeholder="All"
          allowClear
          onChange={(value) => setStatusFilter(value)}
          style={{ width: 200 }}
        >
          <Option value="Open">Open</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </Space>

      <Row gutter={[24, 24]}>
        {filteredOrders.map((order) => (
         <Col xs={24} sm={12} md={8} lg={6} key={order.id}>
         <Card
           title={order.asset}
           bordered={false}
           hoverable
           style={{
             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
             borderRadius: 8,
             transition: 'transform 0.2s',
           }}
           bodyStyle={{ minHeight: '180px' }}
           onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
           onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
         >
           <p><strong>Order ID:</strong> {order.id}</p>
           <p><strong>Part:</strong> {order.part}</p>
           <p><strong>Issue:</strong> {order.issue}</p>
           <p><strong>Priority:</strong> {getPriorityTag(order.priority)}</p>
           <p><strong>Status:</strong> {getStatusTag(order.status)}</p>
         </Card>
       </Col>
        ))}
      </Row>
    </div>
  );
};

export default MaintenanceOrders;
