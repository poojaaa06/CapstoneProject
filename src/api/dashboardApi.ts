// src/api/dashboardApi.ts
import type { DashboardData } from '../types/dashboard'; // Changed from '../data/dashboard'

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
}

class DashboardApi {
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const response = await fetch('/stubs/dashboard.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      return {
        success: false,
        data: {
          metrics: [],
          activities: [],
          requests: [],
          trends: [],
          deptStats: [],
          statusData: [],
          quickStats: [],
        },
        message: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      };
    }
  }
}

export const dashboardApi = new DashboardApi();