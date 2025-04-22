import { folderService } from "@/services";
import { IFolder } from "@/types"; // Assuming IFolder type exists
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all folders within a specific space.
 * Uses folderService.getAllFolders.name, workspaceId, and spaceId as the query key.
 * @param workspaceId - The ID of the workspace containing the space.
 * @param spaceId - The ID of the space whose folders are to be fetched.
 * @param options - Optional React Query query options.
 */
export const useGetFolders = (
  workspaceId: string,
  spaceId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<IFolder[], Error>({
    // Use function name, workspaceId, and spaceId for the query key
    queryKey: [folderService.getAllFolders.name, workspaceId, spaceId],
    queryFn: () => folderService.getAllFolders(workspaceId, spaceId),
    // Ensure IDs are provided and respect enabled option
    enabled:
      !!workspaceId &&
      !!spaceId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};