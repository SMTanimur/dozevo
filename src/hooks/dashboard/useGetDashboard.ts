import { dashboardService } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  dueDate?: string;
  assignee?: string;
  [key: string]: unknown;
}

interface ActivityItem {
  _id: string;
  type: string;
  timestamp: string;
  user: string;
  details: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DashboardData {
  assignedTasks: TaskItem[];
  recentActivity: ActivityItem[];
  navigationTree: {
    _id: string;
    name: string;
    spaces: {
      _id: string;
      name: string;
      lists: {
        _id: string;
        name: string;
      }[];
    }[];
  }[];
}

export const useGetDashboard = (
  workspaceId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['dashboard', workspaceId],
    queryFn: () => dashboardService.getDashboardData(workspaceId),
    enabled: options?.enabled !== false && !!workspaceId,
  });
};
