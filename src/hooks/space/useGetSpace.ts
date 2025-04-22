import { spaceService } from "@/services";
import { ISpace } from "@/types"; // Use ISpace based on type definition convention
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific space by its ID and workspace ID.
 * Uses spaceService.getSpaceById.name, workspaceId, and spaceId as the query key.
 * @param workspaceId - The ID of the workspace the space belongs to.
 * @param spaceId - The ID of the space to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetSpace = (
  workspaceId: string,
  spaceId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<ISpace, Error>({
    // Use function name, workspaceId, and spaceId for the query key
    queryKey: [spaceService.getSpaceById.name, workspaceId, spaceId],
    queryFn: () => spaceService.getSpaceById(workspaceId, spaceId),
    // Ensure IDs are provided and respect enabled option
    enabled:
      !!workspaceId &&
      !!spaceId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
}; 