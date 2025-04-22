import { workspaceService } from "@/services";
import { Workspace } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all workspaces.
 * Uses workspaceService.getAllWorkspaces.name as the query key.
 * @param options - Optional React Query query options.
 */
export const useGetWorkspaces = (options?: { enabled?: boolean }) => {
  return useQuery<Workspace[], Error>({
    // Use function name for the query key
    queryKey: [workspaceService.getAllWorkspaces.name],
    queryFn: () => workspaceService.getAllWorkspaces(),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}; 