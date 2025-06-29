import { dashboardService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export interface TaskTrend {
  date: string;
  created: number;
  completed: number;
  updated: number;
}

export interface TaskTrendsData {
  period: "week" | "month" | "quarter";
  data: TaskTrend[];
  summary: {
    totalCreated: number;
    totalCompleted: number;
    totalUpdated: number;
  };
}

export const useGetTaskTrends = (
  workspaceId: string,
  period: "week" | "month" | "quarter" = "week",
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["task-trends", workspaceId, period],
    queryFn: () => dashboardService.getTaskTrends(workspaceId, period),
    enabled: options?.enabled !== false && !!workspaceId,
  });
};
