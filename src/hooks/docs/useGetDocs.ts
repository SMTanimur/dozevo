import { docsService } from '@/services';
import { IDoc } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseGetDocsParams {
  workspaceId: string;
  spaceId?: string;
  listId?: string;
}

interface UseGetDocsOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch docs within a specific context (space or list).
 * @param params - Context IDs (workspaceId, spaceId or listId)
 * @param options - Optional query options like enabled.
 */
export const useGetDocs = (
  params: UseGetDocsParams,
  options?: UseGetDocsOptions
) => {
  const { workspaceId, spaceId, listId } = params;

  const queryKey = ['docs', workspaceId, spaceId, listId];

  return useQuery<IDoc[], Error>({
    queryKey,
    queryFn: () => {
      if (listId) {
        return docsService.getDocsByList(workspaceId, listId);
      }
      if (spaceId) {
        return docsService.getDocsBySpace(workspaceId, spaceId);
      }
      throw new Error('Either spaceId or listId must be provided');
    },
    enabled:
      !!workspaceId &&
      (!!spaceId || !!listId) &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};
