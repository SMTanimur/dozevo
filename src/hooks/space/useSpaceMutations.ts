import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { spaceService } from '@/services';
import { ISpace } from '@/types';
import { z } from 'zod';
import { createSpaceSchema, updateSpaceSchema } from '@/validations';

// Infer input types from schemas
type CreateSpaceInputData = z.infer<typeof createSpaceSchema>;
type UpdateSpaceInputData = z.infer<typeof updateSpaceSchema>;

// --- Input Types for Mutations ---
interface CreateSpaceMutationInput {
  data: CreateSpaceInputData;
}

interface UpdateSpaceMutationInput {
  workspaceId: string;
  spaceId: string;
  data: UpdateSpaceInputData;
}

interface DeleteSpaceMutationInput {
  workspaceId: string;
  spaceId: string;
}

// --- Hook for Space Mutations ---
export const useSpaceMutations = () => {
  const queryClient = useQueryClient();

  // Helper to invalidate space queries
  const invalidateSpaceQueries = (workspaceId: string, spaceId?: string) => {
    // Invalidate the list of spaces for the workspace
    queryClient.invalidateQueries({
      queryKey: [spaceService.getAllSpaces.name, workspaceId],
    });
    // Invalidate the specific space query if spaceId is provided
    if (spaceId) {
      queryClient.invalidateQueries({
        queryKey: [spaceService.getSpaceById.name, workspaceId, spaceId],
      });
    }
  };

  // --- Create Space ---
  const { mutate: createSpace, isPending: isCreatingSpace } = useMutation<
    ISpace,
    Error,
    CreateSpaceMutationInput // Requires data object containing workspaceId
  >({
    mutationKey: [spaceService.createSpace.name],
    mutationFn: ({ data }) => spaceService.createSpace(data),
    onSuccess: (newSpace) => {
      toast.success(`Space "${newSpace.name}" created successfully!`);
      invalidateSpaceQueries(newSpace.workspace); // Invalidate list using workspaceId from response
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create space.');
    },
  });

  // --- Update Space ---
  const { mutate: updateSpace, isPending: isUpdatingSpace } = useMutation<
    ISpace,
    Error,
    UpdateSpaceMutationInput
  >({
    mutationKey: [spaceService.updateSpace.name],
    mutationFn: ({ workspaceId, spaceId, data }) =>
      spaceService.updateSpace(workspaceId, spaceId, data),
    onSuccess: (updatedSpace, variables) => {
      toast.success(`Space "${updatedSpace.name}" updated successfully!`);
      invalidateSpaceQueries(variables.workspaceId, variables.spaceId);
      // Update the specific space cache
      queryClient.setQueryData(
        [spaceService.getSpaceById.name, variables.workspaceId, variables.spaceId],
        updatedSpace,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update space.');
    },
  });

  // --- Delete Space ---
  const { mutate: deleteSpace, isPending: isDeletingSpace } = useMutation<
    void,
    Error,
    DeleteSpaceMutationInput
  >({
    mutationKey: [spaceService.deleteSpace.name],
    mutationFn: ({ workspaceId, spaceId }) =>
      spaceService.deleteSpace(workspaceId, spaceId),
    onSuccess: (_, variables) => {
      toast.success('Space deleted successfully!');
      invalidateSpaceQueries(variables.workspaceId, variables.spaceId);
      // Remove the specific space from cache
      queryClient.removeQueries({
        queryKey: [
          spaceService.getSpaceById.name,
          variables.workspaceId,
          variables.spaceId,
        ],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete space.');
    },
  });

  return {
    createSpace,
    isCreatingSpace,
    updateSpace,
    isUpdatingSpace,
    deleteSpace,
    isDeletingSpace,
  };
}; 