import { spaceService } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface OverviewData {
  recentTasks: Record<string, unknown>[];
  workloadByStatus: Record<string, unknown>[];
  recentDocs: Record<string, unknown>[];
  totalTasks: number;
  totalDocs: number;
}

interface UseGetOverviewParams {
  workspaceId: string;
  spaceId: string;
}

interface UseGetOverviewOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch overview data for a specific space.
 * @param params - Context IDs (workspaceId, spaceId)
 * @param options - Optional query options like enabled.
 */
export const useGetOverview = (
  params: UseGetOverviewParams,
  options?: UseGetOverviewOptions
) => {
  const { workspaceId, spaceId } = params;

  const queryKey = ['space-overview', workspaceId, spaceId];

  return useQuery<OverviewData, Error>({
    queryKey,
    queryFn: () => spaceService.getOverview(workspaceId, spaceId),
    enabled:
      !!workspaceId &&
      !!spaceId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};
