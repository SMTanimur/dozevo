import { workspaceService } from "@/services";
import { Workspace } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific workspace by its ID.
 * Uses workspaceService.getWorkspaceById.name as part of the query key.
 * @param workspaceId - The ID of the workspace to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetWorkspace = (workspaceId: string, options?: { enabled?: boolean }) => {
  return useQuery<Workspace, Error>({
    // Use function name and ID for the query key
    queryKey: [workspaceService.getWorkspaceById.name, workspaceId],
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
    // Ensure workspaceId is provided and respect enabled option
    enabled: !!workspaceId && (options?.enabled !== undefined ? options.enabled : true),
  });
}; 