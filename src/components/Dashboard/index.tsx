import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Table,
  Button,
  Space,
  List,
  Avatar,
  Modal,
  Descriptions,
  message,
  Grid,
  Drawer,
  Segmented,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EyeOutlined,
  ReloadOutlined,
  PlusOutlined,
  MenuOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import MetricCard from '../MetricCard';
import QuickStatCard from '../QuickStatCard';
import StatusBadge from '../StatusBadge';
import type { 
  RecentRequest, 
  MonthlyTrend, 
  DepartmentStat, 
  StatusBreakdown,
  MetricCardData,
  ActivityItem,
  QuickStat,
  DashboardData 
} from '../../types/dashboard';

import './Dashboard.css';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Custom ECharts Component with responsive options
const EChartComponent: React.FC<{ option: any; height?: number; style?: React.CSSProperties; isMobile?: boolean }> = ({ 
  option, 
  height = 300,
  style = {},
  isMobile = false
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstance = React.useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      const mobileOptions = isMobile ? {
        ...option,
        legend: {
          ...option.legend,
          orient: 'horizontal',
          bottom: 0,
          left: 'center',
          itemWidth: 6,
          itemHeight: 6,
          textStyle: { fontSize: 10 }
        },
        grid: {
          ...option.grid,
          left: '8%',
          right: '5%',
          containLabel: true
        },
        tooltip: {
          ...option.tooltip,
          textStyle: { fontSize: 12 },
          position: 'top'
        },
        series: option.series?.map((series: any) => ({
          ...series,
          symbolSize: isMobile ? 4 : 6,
          label: {
            ...series.label,
            show: false
          }
        }))
      } : option;
      
      chartInstance.current.setOption(mobileOptions);
    }

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [option, isMobile]);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: `${isMobile ? height * 0.7 : height}px`,
        ...style 
      }} 
    />
  );
};

// Icon map for metric cards
const ICON_MAP: Record<string, React.ReactNode> = {
  FileTextOutlined: <FileTextOutlined />,
  ClockCircleOutlined: <ClockCircleOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  UserOutlined: <UserOutlined />,
};

// Helper functions
const getAvatarColor = (initials: string): string => {
  const colors = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0891b2'];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

const formatTimeAgo = (timestamp: string): string => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} minutes ago`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
};

// Chart builders
const buildLineChartOptions = (data: MonthlyTrend[]) => ({
  tooltip: { trigger: 'axis', borderRadius: 8, axisPointer: { type: 'shadow' } },
  legend: { data: ['Submitted', 'Approved', 'Delivered'], bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8 },
  grid: { top: 30, left: 50, right: 20, bottom: 40, containLabel: true },
  xAxis: { type: 'category', data: data.map(d => d.month), axisLabel: { fontSize: 11, rotate: 0 } },
  yAxis: { type: 'value', splitLine: { type: 'dashed' } },
  series: [
    { name: 'Submitted', data: data.map(d => d.submitted), type: 'line', smooth: true, lineStyle: { color: '#2563eb', width: 2 }, symbol: 'circle', symbolSize: 6 },
    { name: 'Approved', data: data.map(d => d.approved), type: 'line', smooth: true, lineStyle: { color: '#16a34a', width: 2 }, symbol: 'circle', symbolSize: 6 },
    { name: 'Delivered', data: data.map(d => d.delivered), type: 'line', smooth: true, lineStyle: { color: '#7c3aed', width: 2 }, symbol: 'circle', symbolSize: 6 },
  ],
});

const buildBarChartOptions = (data: DepartmentStat[]) => ({
  tooltip: { trigger: 'axis', borderRadius: 8, axisPointer: { type: 'shadow' } },
  grid: { top: 10, left: 100, right: 20, bottom: 10, containLabel: true },
  xAxis: { type: 'value', splitLine: { type: 'dashed' } },
  yAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 12 } },
  series: [{ type: 'bar', data: data.map(d => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [0, 4, 4, 0] } })), barMaxWidth: 24, label: { show: true, position: 'right', fontSize: 11 } }],
});

const buildDonutChartOptions = (data: StatusBreakdown[], isMobile: boolean = false) => ({
  tooltip: { 
    trigger: 'item', 
    formatter: '{b}: {c} ({d}%)',
    position: isMobile ? 'top' : undefined,
  },
  legend: { 
    orient: isMobile ? 'horizontal' : 'vertical',
    left: isMobile ? 'center' : 'right',
    top: isMobile ? 'bottom' : 'middle',
    bottom: isMobile ? 0 : undefined,
    right: isMobile ? undefined : 0,
    icon: 'circle', 
    itemWidth: isMobile ? 6 : 8, 
    itemHeight: isMobile ? 6 : 8,
    textStyle: { fontSize: isMobile ? 10 : 11 },
    // For mobile, arrange legend in a row
    ...(isMobile && {
      type: 'scroll',
      pageIconColor: '#666',
      pageTextStyle: { fontSize: 10 }
    })
  },
  series: [{ 
    type: 'pie', 
    radius: isMobile ? ['40%', '65%'] : ['48%', '72%'],
    center: isMobile ? ['50%', '45%'] : ['38%', '50%'],
    data: data.map(d => ({ 
      name: d.status, 
      value: d.count, 
      itemStyle: { color: d.color } 
    })), 
    label: { 
      show: false 
    },
    // Add these for better mobile display
    avoidLabelOverlap: true,
    labelLine: { show: false }
  }],
  // Add padding for mobile
  grid: isMobile ? { containLabel: true, top: 20, bottom: 50 } : undefined,
});

// Initial state
const initialState: DashboardData = {
  metrics: [],
  activities: [],
  requests: [],
  trends: [],
  deptStats: [],
  statusData: [],
  quickStats: [],
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialState);
  const [selectedRequest, setSelectedRequest] = useState<RecentRequest | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [mobileViewMode, setMobileViewMode] = useState<'charts' | 'table'>('charts');
  const [activityDrawerVisible, setActivityDrawerVisible] = useState<boolean>(false);
  
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from public folder
      const response = await fetch('/stubs/dashboard.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Assuming the API returns data in the same format as before
      if (data.success) {
        setDashboardData(data.data);
        setLastRefreshed(new Date().toLocaleTimeString());
      } else {
        // If the JSON doesn't have success wrapper, use the data directly
        setDashboardData(data);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    await loadData();
    message.success('Dashboard refreshed', 2);
  };

  // Responsive table columns for mobile
  const getTableColumns = (): ColumnsType<RecentRequest> => {
    const baseColumns: ColumnsType<RecentRequest> = [
      { title: 'Part Name', dataIndex: 'partName', key: 'partName', sorter: (a, b) => a.partName.localeCompare(b.partName), ellipsis: true },
      { 
        title: 'Status', 
        dataIndex: 'status', 
        key: 'status', 
        render: (status: 'Pending' | 'Approved' | 'Delivered' | 'Rejected') => <StatusBadge status={status} />,
        width: isMobile ? 100 : undefined,
      },
      {
        title: '',
        key: 'action',
        width: 60,
        render: (_: unknown, record: RecentRequest) => (
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => { 
              setSelectedRequest(record); 
              setModalVisible(true); 
            }}
          />
        ),
      },
    ];

    if (!isMobile) {
      baseColumns.splice(2, 0, 
        { title: 'Qty', dataIndex: 'quantity', key: 'quantity', align: 'center', width: 70, sorter: (a, b) => a.quantity - b.quantity },
        { title: 'Department', dataIndex: 'department', key: 'department', ellipsis: true },
        { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy', ellipsis: true },
        { 
          title: 'Urgency', 
          dataIndex: 'urgency', 
          key: 'urgency',
          render: (urgency: string) => {
            const className = `urgency-badge urgency-${urgency.toLowerCase()}`;
            return <span className={className}>{urgency}</span>;
          }
        },
        { title: 'Date', dataIndex: 'requestedOn', key: 'requestedOn', sorter: (a, b) => a.requestedOn.localeCompare(b.requestedOn) }
      );
    }

    return baseColumns;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <Title level={isMobile ? 4 : 3}>Dashboard</Title>
            <Text>Loading...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className={`dashboard-header ${isMobile ? 'mobile-header' : ''}`}>
          <div className="header-title-section">
            <Title level={isMobile ? 4 : 3} className="dashboard-title">Dashboard</Title>
            {!isMobile && <Text className="dashboard-subtitle">Parts & Procurement · Updated {lastRefreshed}</Text>}
          </div>
          <Space wrap className="header-actions">
            {isMobile && (
              <Button 
                icon={<MenuOutlined />} 
                onClick={() => setActivityDrawerVisible(true)}
              >
                Activity
              </Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} size={isMobile ? 'middle' : 'large'}>
              {!isMobile && 'Refresh'}
            </Button>
            
          </Space>
          {isMobile && (
            <Text className="mobile-update-time">Updated {lastRefreshed}</Text>
          )}
        </div>

        {/* Metric Cards - Responsive Grid */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} className="dashboard-row">
          {dashboardData.metrics?.map((metric: MetricCardData) => (
            <Col xs={24} sm={12} lg={6} key={metric.id}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                trend={metric.trend}
                trendLabel={metric.trendLabel}
                icon={ICON_MAP[metric.iconName]}
                accentColor={metric.accentColor}
                isMobile={isMobile}
              />
            </Col>
          ))}
        </Row>

        {/* Charts Section with Mobile View Toggle */}
        {isMobile && (
          <div className="mobile-view-toggle">
            <Segmented
              value={mobileViewMode}
              onChange={(value) => setMobileViewMode(value as 'charts' | 'table')}
              options={[
                { label: <span><BarChartOutlined /> Charts</span>, value: 'charts' },
                { label: <span><UnorderedListOutlined /> Requests</span>, value: 'table' },
              ]}
              block
            />
          </div>
        )}

        {(!isMobile || mobileViewMode === 'charts') && (
          <>
            {/* Charts Row */}
            <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} className="dashboard-row">
              <Col xs={24} lg={14}>
                <Card title="Request Trends — 2024" className="dashboard-card" size={isMobile ? 'small' : 'default'}>
                  <EChartComponent option={buildLineChartOptions(dashboardData.trends || [])} height={isMobile ? 250 : 300} isMobile={isMobile} />
                </Card>
              </Col>
              <Col xs={24} lg={10}>
                <Card title="Status Breakdown" className="dashboard-card" size={isMobile ? 'small' : 'default'}>
                 <EChartComponent 
  option={buildDonutChartOptions(dashboardData.statusData || [], isMobile)} 
  height={isMobile ? 280 : 300} 
  isMobile={isMobile} 
/>
                </Card>
              </Col>
            </Row>

            {/* Department Stats & Quick Stats */}
            <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} className="dashboard-row">
              <Col xs={24} lg={12}>
                <Card title="Requests by Department" className="dashboard-card" size={isMobile ? 'small' : 'default'}>
                  <EChartComponent option={buildBarChartOptions(dashboardData.deptStats || [])} height={isMobile ? 200 : 250} isMobile={isMobile} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="At a Glance" className="dashboard-card" size={isMobile ? 'small' : 'default'}>
                  <Row gutter={[isMobile ? 8 : 12, isMobile ? 8 : 12]}>
                    {dashboardData.quickStats?.map((stat: QuickStat) => (
                      <Col xs={12} key={stat.id}>
                        <QuickStatCard 
                          value={stat.value}
                          label={stat.label}
                          sublabel={stat.sublabel}
                          color={stat.color}
                          bgColor={stat.bgColor}
                          borderColor={stat.borderColor}
                          isMobile={isMobile}
                        />
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Activity & Requests Table */}
        {(!isMobile || mobileViewMode === 'table') && (
          <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} className="dashboard-row">
            {!isMobile && (
              <Col xs={24} lg={8}>
                <Card title="Recent Activity" className="dashboard-card">
                  <List
                    dataSource={dashboardData.activities || []}
                    renderItem={(item: ActivityItem) => (
                      <List.Item className="activity-item">
                        <List.Item.Meta
                          avatar={<Avatar style={{ backgroundColor: getAvatarColor(item.initials) }}>{item.initials}</Avatar>}
                          title={
                            <div className="activity-title">
                              <strong>{item.user}</strong> {item.action} <strong>{item.target}</strong>
                            </div>
                          }
                          description={
                            <div className="activity-meta">
                              {formatTimeAgo(item.timestamp)} · {item.department}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}
            <Col xs={24} lg={16}>
              <Card 
                title={isMobile ? "Purchase Requests" : "Recent Purchase Requests"} 
                className="dashboard-card"
                size={isMobile ? 'small' : 'default'}
                extra={isMobile && dashboardData.activities?.length > 0 && (
                  <Button type="link" size="small" onClick={() => setActivityDrawerVisible(true)}>
                    View Activity
                  </Button>
                )}
              >
                <Table 
                  columns={getTableColumns()} 
                  dataSource={dashboardData.requests || []} 
                  rowKey="id" 
                  pagination={{ 
                    pageSize: isMobile ? 3 : 5, 
                    showTotal: (total) => isMobile ? `${total}` : `${total} requests`,
                    size: isMobile ? 'small' : 'default'
                  }} 
                  scroll={{ x: isMobile ? undefined : 700 }}
                  size={isMobile ? 'small' : 'middle'}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>

      {/* Activity Drawer for Mobile */}
      <Drawer
        title="Recent Activity"
        placement="bottom"
        onClose={() => setActivityDrawerVisible(false)}
        open={activityDrawerVisible}
        height="70%"
        className="mobile-activity-drawer"
      >
        <List
          dataSource={dashboardData.activities || []}
          renderItem={(item: ActivityItem) => (
            <List.Item className="activity-item">
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: getAvatarColor(item.initials) }}>{item.initials}</Avatar>}
                title={
                  <div className="activity-title">
                    <strong>{item.user}</strong> {item.action} <strong>{item.target}</strong>
                  </div>
                }
                description={
                  <div className="activity-meta">
                    {formatTimeAgo(item.timestamp)} · {item.department}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* Detail Modal - Full screen on mobile */}
      <Modal 
        title="Request Details" 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>Close</Button>, 
          <Button key="approve" type="primary">Approve</Button>
        ]} 
        width={isMobile ? '100%' : 520}
        style={isMobile ? { top: 0, maxWidth: '100%', paddingBottom: 0 } : {}}
        bodyStyle={isMobile ? { maxHeight: '70vh', overflowY: 'auto' } : {}}
      >
        {selectedRequest && (
          <Descriptions bordered column={1} size={isMobile ? 'small' : 'middle'}>
            <Descriptions.Item label="Request ID">{selectedRequest.id}</Descriptions.Item>
            <Descriptions.Item label="Part Name">{selectedRequest.partName}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{selectedRequest.quantity}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedRequest.department}</Descriptions.Item>
            <Descriptions.Item label="Requested By">{selectedRequest.requestedBy}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedRequest.requestedOn}</Descriptions.Item>
            <Descriptions.Item label="Urgency">
              <span className={`urgency-badge urgency-${selectedRequest.urgency.toLowerCase()}`}>
                {selectedRequest.urgency}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusBadge status={selectedRequest.status} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;