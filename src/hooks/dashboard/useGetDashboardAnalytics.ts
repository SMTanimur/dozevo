import { dashboardService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export interface DashboardAnalytics {
  taskCompletionRate: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  taskDistribution: {
    toDo: number;
    inProgress: number;
    completed: number;
    blocked: number;
  };
  userActivity: {
    active: number;
    inactive: number;
  };
}

export const useGetDashboardAnalytics = (
  workspaceId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['dashboard-analytics', workspaceId],
    queryFn: () => dashboardService.getDashboardAnalytics(workspaceId),
    enabled: options?.enabled !== false && !!workspaceId,
  });
};
