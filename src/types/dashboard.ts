// src/types/dashboard.ts (create this new file)
export type RequestStatus = 'Pending' | 'Approved' | 'Delivered' | 'Rejected';
export type UrgencyLevel = 'Low' | 'Medium' | 'High';
export type ActivityStatus = 'success' | 'pending' | 'failed';

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  iconName: 'FileTextOutlined' | 'ClockCircleOutlined' | 'CheckCircleOutlined' | 'UserOutlined';
  accentColor: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  initials: string;
  action: string;
  target: string;
  timestamp: string;
  status: ActivityStatus;
  department: string;
}

export interface RecentRequest {
  id: string;
  partName: string;
  quantity: number;
  status: RequestStatus;
  requestedOn: string;
  department: string;
  urgency: UrgencyLevel;
  requestedBy: string;
}

export interface MonthlyTrend {
  month: string;
  submitted: number;
  approved: number;
  delivered: number;
}

export interface DepartmentStat {
  name: string;
  value: number;
  color: string;
}

export interface StatusBreakdown {
  status: RequestStatus;
  count: number;
  color: string;
}

export interface QuickStat {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface DashboardData {
  metrics: MetricCardData[];
  activities: ActivityItem[];
  requests: RecentRequest[];
  trends: MonthlyTrend[];
  deptStats: DepartmentStat[];
  statusData: StatusBreakdown[];
  quickStats: QuickStat[];
}