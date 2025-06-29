import { taskService } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface WorkloadStatus {
  status: string;
  count: number;
  color?: string;
}

interface UseGetWorkloadByStatusParams {
  spaceId: string;
}

interface UseGetWorkloadByStatusOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch task workload by status for a specific space.
 * @param params - Context IDs (spaceId)
 * @param options - Optional query options like enabled.
 */
export const useGetWorkloadByStatus = (
  params: UseGetWorkloadByStatusParams,
  options?: UseGetWorkloadByStatusOptions
) => {
  const { spaceId } = params;

  const queryKey = ['workload-by-status', spaceId];

  return useQuery<{ data: WorkloadStatus[] }, Error>({
    queryKey,
    queryFn: () => taskService.getWorkloadByStatus(spaceId),
    enabled:
      !!spaceId && (options?.enabled !== undefined ? options.enabled : true),
  });
};
