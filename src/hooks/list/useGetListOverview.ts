import { listService } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface ListOverviewData {
  recentTasks: Record<string, unknown>[];
  workloadByStatus: Record<string, unknown>[];
  totalTasks: number;
  totalStatuses: number;
}

interface UseGetListOverviewParams {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

interface UseGetListOverviewOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch overview data for a specific list.
 * @param params - Context IDs (workspaceId, spaceId, listId)
 * @param options - Optional query options like enabled.
 */
export const useGetListOverview = (
  params: UseGetListOverviewParams,
  options?: UseGetListOverviewOptions
) => {
  const { workspaceId, spaceId, listId } = params;

  const queryKey = ['list-overview', workspaceId, spaceId, listId];

  return useQuery<ListOverviewData, Error>({
    queryKey,
    queryFn: () => listService.getOverview(workspaceId, spaceId, listId),
    enabled:
      !!workspaceId &&
      !!spaceId &&
      !!listId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};
