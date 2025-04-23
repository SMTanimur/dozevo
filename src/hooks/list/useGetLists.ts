import { listService } from "@/services";
import { IList } from "@/types"; // Assuming IFolder type exists
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all lists within a specific space.
 * Uses listService.getAllLists.name, workspaceId, and spaceId as the query key.
 * @param workspaceId - The ID of the workspace containing the space.
* @param spaceId - The ID of the space whose lists are to be fetched.
 * @param options - Optional React Query query options.
 */
export const useGetLists = (
  workspaceId: string,
  spaceId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<IList[], Error>({
    // Use function name, workspaceId, and spaceId for the query key
    queryKey: [listService.getAllLists.name, workspaceId, spaceId],
    queryFn: () => listService.getAllLists(workspaceId, spaceId),
    // Ensure IDs are provided and respect enabled option
    enabled:
      !!workspaceId &&
      !!spaceId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};