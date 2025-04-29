import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { listService } from '@/services'; // Adjust path if needed

import { AxiosError } from 'axios';
import { IStatusDefinition } from '@/types';

interface UseGetStatusesParams {
  workspaceId: string;
  spaceId: string;
  listId: string;
}



export const useGetStatuses = (
  params: UseGetStatusesParams,
  options?: Omit<
    UseQueryOptions<IStatusDefinition[], AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  const { workspaceId, spaceId, listId } = params;
  return useQuery<IStatusDefinition[], AxiosError>({
    queryKey: [listService.getStatuses.name, workspaceId, spaceId, listId],
    queryFn: async () => listService.getStatuses(workspaceId, spaceId, listId),
    enabled: !!workspaceId && !!spaceId && !!listId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
