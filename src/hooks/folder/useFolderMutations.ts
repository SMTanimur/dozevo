import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { folderService } from '@/services';
import { IFolder } from '@/types';
import { z } from 'zod';
import { createFolderSchema, updateFolderSchema } from '@/validations';

// Infer input types from schemas
type CreateFolderInputData = z.infer<typeof createFolderSchema>;
type UpdateFolderInputData = z.infer<typeof updateFolderSchema>;

// --- Input Types for Mutations ---
interface CreateFolderMutationInput {
  // workspaceId is needed for the API path, but not part of createFolderSchema
  // It must be passed alongside the schema data.
  workspaceId: string;
  data: CreateFolderInputData; // Contains spaceId
}

interface UpdateFolderMutationInput {
  workspaceId: string;
  spaceId: string;
  folderId: string;
  data: UpdateFolderInputData;
}

interface DeleteFolderMutationInput {
  workspaceId: string;
  spaceId: string;
  folderId: string;
}

// --- Hook for Folder Mutations ---
export const useFolderMutations = () => {
  const queryClient = useQueryClient();

  // Helper to invalidate folder queries
  const invalidateFolderQueries = (
    workspaceId: string,
    spaceId: string,
    folderId?: string,
  ) => {
    // Invalidate the list of folders for the space
    queryClient.invalidateQueries({
      queryKey: [folderService.getAllFolders.name, workspaceId, spaceId],
    });
    // Invalidate the specific folder query if folderId is provided
    if (folderId) {
      queryClient.invalidateQueries({
        queryKey: [folderService.getFolderById.name, workspaceId, spaceId, folderId],
      });
    }
  };

  // --- Create Folder ---
  const { mutate: createFolder, isPending: isCreatingFolder } = useMutation<
    IFolder,
    Error,
    CreateFolderMutationInput
  >({
    mutationKey: [folderService.createFolder.name],
    // Note: The service implementation has a TODO for workspaceId.
    // We pass data directly, assuming service handles context or is fixed.
    // If workspaceId is strictly needed by the service method itself,
    // this mutationFn signature might need adjustment.
    mutationFn: ({ data }) => folderService.createFolder(data),
    onSuccess: (newFolder) => {
      toast.success(`Folder "${newFolder.name}" created successfully!`);
      // Invalidate using workspaceId and spaceId from the response
      invalidateFolderQueries(newFolder.workspace, newFolder.space);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create folder.');
    },
  });

  // --- Update Folder ---
  const { mutate: updateFolder, isPending: isUpdatingFolder } = useMutation<
    IFolder,
    Error,
    UpdateFolderMutationInput
  >({
    mutationKey: [folderService.updateFolder.name],
    mutationFn: ({ workspaceId, spaceId, folderId, data }) =>
      folderService.updateFolder(workspaceId, spaceId, folderId, data),
    onSuccess: (updatedFolder, variables) => {
      toast.success(`Folder "${updatedFolder.name}" updated successfully!`);
      invalidateFolderQueries(
        variables.workspaceId,
        variables.spaceId,
        variables.folderId,
      );
      // Update the specific folder cache
      queryClient.setQueryData(
        [
          folderService.getFolderById.name,
          variables.workspaceId,
          variables.spaceId,
          variables.folderId,
        ],
        updatedFolder,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update folder.');
    },
  });

  // --- Delete Folder ---
  const { mutate: deleteFolder, isPending: isDeletingFolder } = useMutation<
    void,
    Error,
    DeleteFolderMutationInput
  >({
    mutationKey: [folderService.deleteFolder.name],
    mutationFn: ({ workspaceId, spaceId, folderId }) =>
      folderService.deleteFolder(workspaceId, spaceId, folderId),
    onSuccess: (_, variables) => {
      toast.success('Folder deleted successfully!');
      invalidateFolderQueries(
        variables.workspaceId,
        variables.spaceId,
        variables.folderId,
      );
      // Remove the specific folder from cache
      queryClient.removeQueries({
        queryKey: [
          folderService.getFolderById.name,
          variables.workspaceId,
          variables.spaceId,
          variables.folderId,
        ],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete folder.');
    },
  });

  return {
    createFolder,
    isCreatingFolder,
    updateFolder,
    isUpdatingFolder,
    deleteFolder,
    isDeletingFolder,
  };
}; 