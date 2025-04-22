import { spaceService } from "@/services";
import { ISpace } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all spaces within a specific workspace.
 * Uses spaceService.getAllSpaces.name and workspaceId as the query key.
 * @param workspaceId - The ID of the workspace whose spaces are to be fetched.
 * @param options - Optional React Query query options.
 */
export const useGetSpaces = (workspaceId: string, options?: { enabled?: boolean }) => {
  return useQuery<ISpace[], Error>({
    // Use function name and workspaceId for the query key
    queryKey: [spaceService.getAllSpaces.name, workspaceId],
    queryFn: () => spaceService.getAllSpaces(workspaceId),
    // Ensure workspaceId is provided and respect enabled option
    enabled: !!workspaceId && (options?.enabled !== undefined ? options.enabled : true),
  });
}; 