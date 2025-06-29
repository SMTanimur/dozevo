import { api as apiClient } from '../../api';
import { DashboardData } from '@/hooks/dashboard/useGetDashboard';

class DashboardService {
  async getDashboardData(workspaceId: string) {
    try {
      const response = await apiClient.get(`/dashboard/${workspaceId}`);

      // Add additional data processing for enhanced UI if needed
      const data = response.data as DashboardData;

      // Ensure tasks have priority if not set
      if (data.assignedTasks) {
        data.assignedTasks = data.assignedTasks.map(task => {
          if (!task.priority) {
            // Assign random priority for demo purposes if not set
            const priorities = ['high', 'medium', 'low'] as const;
            task.priority =
              priorities[Math.floor(Math.random() * priorities.length)];
          }
          return task;
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getDashboardAnalytics(workspaceId: string) {
    try {
      const response = await apiClient.get(
        `/dashboard/${workspaceId}/analytics`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  async getTaskTrends(
    workspaceId: string,
    period: 'week' | 'month' | 'quarter' = 'week'
  ) {
    try {
      const response = await apiClient.get(
        `/dashboard/${workspaceId}/task-trends?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching task trends:', error);
      throw error;
    }
  }

  async getUserProductivity(workspaceId: string, userId?: string) {
    try {
      const url = userId
        ? `/dashboard/${workspaceId}/productivity/${userId}`
        : `/dashboard/${workspaceId}/productivity`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user productivity:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
