import { folderService } from "@/services";
import { IFolder } from "@/types"; // Assuming IFolder type exists
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific folder by its ID and context IDs.
 * Uses folderService.getFolderById.name and context IDs as the query key.
 * @param workspaceId - The ID of the workspace.
 * @param spaceId - The ID of the space.
 * @param folderId - The ID of the folder to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetFolder = (
  workspaceId: string,
  spaceId: string,
  folderId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<IFolder, Error>({
    // Use function name, workspaceId, spaceId, and folderId for the query key
    queryKey: [folderService.getFolderById.name, workspaceId, spaceId, folderId],
    queryFn: () => folderService.getFolderById(workspaceId, spaceId, folderId),
    // Ensure IDs are provided and respect enabled option
    enabled:
      !!workspaceId &&
      !!spaceId &&
      !!folderId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
}; 