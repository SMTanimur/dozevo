import { listService } from "@/services";
import { IList } from "@/types"; // Assuming IFolder type exists
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific folder by its ID and context IDs.
 * Uses listService.getListById.name and context IDs as the query key.
 * @param workspaceId - The ID of the workspace.
 * @param spaceId - The ID of the space.
 * @param listId - The ID of the list to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetList = (
  workspaceId: string,
  spaceId: string,
  listId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<IList, Error>({
    // Use function name, workspaceId, spaceId, and folderId for the query key
    queryKey: [listService.getListById.name, workspaceId, spaceId, listId],
    queryFn: () => listService.getListById(workspaceId, spaceId, listId),
    // Ensure IDs are provided and respect enabled option
    enabled:
      !!workspaceId &&
      !!spaceId &&
      !!listId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
}; 