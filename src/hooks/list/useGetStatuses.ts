import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { listService } from '@/services'; // Adjust path if needed
import { TStatus } from '@/types/status';
import { AxiosError } from 'axios';

interface UseGetStatusesParams {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

export const getStatusesQueryKey = (params: UseGetStatusesParams) => [
  'workspaces',
  params.workspaceId,
  'spaces',
  params.spaceId,
  'lists',
  params.listId,
  'statuses',
];

export const useGetStatuses = (
  params: UseGetStatusesParams,
  options?: Omit<UseQueryOptions<TStatus[], AxiosError>, 'queryKey' | 'queryFn'>
) => {
  const { workspaceId, spaceId, listId } = params;
  return useQuery<TStatus[], AxiosError>({
    queryKey: getStatusesQueryKey(params),
    queryFn: async () => listService.getStatuses(workspaceId, spaceId, listId),
    enabled: !!workspaceId && !!spaceId && !!listId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
