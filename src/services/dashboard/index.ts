import { api } from '@/api';

export const dashboardService = {
  getDashboardData: async (workspaceId: string) => {
    const response = await api.get(`/workspaces/${workspaceId}/dashboard`);
    return response.data;
  },
};
