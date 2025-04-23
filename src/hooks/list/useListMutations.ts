import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listService } from '@/services';
import { IList } from '@/types';
import { z } from 'zod';
import { createlistSchema, updatelistSchema } from '@/validations';

// Infer input types from schemas
type CreateListInputData = z.infer<typeof createlistSchema>;
type UpdateListInputData = z.infer<typeof updatelistSchema>;

// --- Input Types for Mutations ---
interface CreateListMutationInput {
  // workspaceId is needed for the API path, but not part of createlistSchema
  // It must be passed alongside the schema data.
  workspaceId: string;
  data: CreateListInputData; // Contains spaceId
}

interface UpdateListMutationInput {
  workspaceId: string;
  spaceId: string;
  listId: string;
  data: UpdateListInputData;
}

interface DeleteListMutationInput {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

// --- Hook for List Mutations ---
export const useListMutations = () => {
  const queryClient = useQueryClient();

  // Helper to invalidate list queries
  const invalidateListQueries = (
    workspaceId: string,
    spaceId: string,
    listId?: string,
  ) => {
    // Invalidate the list of folders for the space
    queryClient.invalidateQueries({
      queryKey: [listService.getAllLists.name, workspaceId, spaceId],
    });
    // Invalidate the specific list query if listId is provided
    if (listId) {
      queryClient.invalidateQueries({
        queryKey: [listService.getListById.name, workspaceId, spaceId, listId],
      });
    }
  };

  // --- Create Folder ---
  const { mutate: createList, isPending: isCreatingList } = useMutation<
    IList,
    Error,
    CreateListMutationInput
  >({
    mutationKey: [listService.createList.name],
    // Note: The service implementation has a TODO for workspaceId.
    // We pass data directly, assuming service handles context or is fixed.
    // If workspaceId is strictly needed by the service method itself,
    // this mutationFn signature might need adjustment.
    mutationFn: ({ data }) => listService.createList(data),
    onSuccess: (newList) => {
      toast.success(`List "${newList.name}" created successfully!`);
      // Invalidate using workspaceId and spaceId from the response
      invalidateListQueries(newList.workspace, newList.space);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create list.');
    },
  });

  // --- Update Folder ---
  const { mutate: updateList, isPending: isUpdatingList } = useMutation<
    IList,
    Error,
    UpdateListMutationInput
  >({
    mutationKey: [listService.updateList.name],
    mutationFn: ({ workspaceId, spaceId, listId, data }) =>
      listService.updateList(workspaceId, spaceId, listId, data),
    onSuccess: (updatedList, variables) => {
      toast.success(`List "${updatedList.name}" updated successfully!`);
      invalidateListQueries(
        variables.workspaceId,
        variables.spaceId,
        variables.listId,
      );
      // Update the specific folder cache
      queryClient.setQueryData(
        [
          listService.getListById.name,
          variables.workspaceId,
          variables.spaceId,
          variables.listId,
        ],
        updatedList,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update list.');
    },
  });

  // --- Delete Folder ---
  const { mutate: deleteList, isPending: isDeletingList } = useMutation<
    void,
    Error,
    DeleteListMutationInput
  >({
    mutationKey: [listService.deleteList.name],
    mutationFn: ({ workspaceId, spaceId, listId }) =>
      listService.deleteList(workspaceId, spaceId, listId),
    onSuccess: (_, variables) => {
      toast.success('List deleted successfully!');
      invalidateListQueries(
        variables.workspaceId,
        variables.spaceId,
        variables.listId,
      );
      // Remove the specific folder from cache
      queryClient.removeQueries({
        queryKey: [
          listService.getListById.name,
          variables.workspaceId,
          variables.spaceId,
          variables.listId,
        ],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete list.');
    },
  });

  return {
    createList,
    isCreatingList,
    updateList,
    isUpdatingList,
    deleteList,
    isDeletingList,
  };
}; 