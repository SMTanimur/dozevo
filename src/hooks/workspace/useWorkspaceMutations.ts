import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workspaceService } from '@/services';
import { Workspace } from '@/types';
import { TCreateWorkspace, TUpdateWorkspace } from '@/validations'; // Assuming these types are exported

// Hook for Workspace Mutations (Create, Update, Delete)
export const useWorkspaceMutations = () => {
  const queryClient = useQueryClient();

  const invalidateWorkspaceQueries = () => {
    // Invalidate queries for the list of all workspaces
    queryClient.invalidateQueries({
      queryKey: [workspaceService.getAllWorkspaces.name],
    });
    // Note: Invalidating individual workspace queries ([getWorkspaceById.name, id])
    // usually happens after a specific update/delete, using the relevant ID.
  };

  // Mutation for creating a workspace
  const { mutate: createWorkspace, isPending: isCreating } = useMutation<
    Workspace,
    Error,
    TCreateWorkspace
  >({
    mutationKey: [workspaceService.createWorkspace.name],
    mutationFn: (data: TCreateWorkspace) => workspaceService.createWorkspace(data),
    onSuccess: (newWorkspace) => {
      toast.success(`Workspace "${newWorkspace.name}" created successfully!`);
      invalidateWorkspaceQueries();
      // Optionally, redirect or perform other actions
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create workspace.');
    },
  });

  // Mutation for updating a workspace
  const { mutate: updateWorkspace, isPending: isUpdating } = useMutation<
    Workspace,
    Error,
    { id: string; data: TUpdateWorkspace }
  >({
    mutationKey: [workspaceService.updateWorkspace.name],
    mutationFn: ({ id, data }) => workspaceService.updateWorkspace(id, data),
    onSuccess: (updatedWorkspace, variables) => {
      toast.success(
        `Workspace "${updatedWorkspace.name}" updated successfully!`,
      );
      invalidateWorkspaceQueries();
      // Invalidate the specific workspace query as well
      queryClient.invalidateQueries({
        queryKey: [workspaceService.getWorkspaceById.name, variables.id],
      });
      // Update the specific workspace query data in the cache
      queryClient.setQueryData(
        [workspaceService.getWorkspaceById.name, variables.id],
        updatedWorkspace,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update workspace.');
    },
  });

  // Mutation for deleting a workspace
  const { mutate: deleteWorkspace, isPending: isDeleting } = useMutation<
    void,
    Error,
    string // Expects workspace ID
  >({
    mutationKey: [workspaceService.deleteWorkspace.name],
    mutationFn: (id: string) => workspaceService.deleteWorkspace(id),
    onSuccess: (_, workspaceId) => {
      toast.success('Workspace deleted successfully!');
      invalidateWorkspaceQueries();
      // Remove the deleted workspace from the cache for the specific query
      queryClient.removeQueries({
        queryKey: [workspaceService.getWorkspaceById.name, workspaceId],
      });
      // Optionally, update the list query cache if feasible/necessary
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete workspace.');
    },
  });

  return {
    createWorkspace,
    isCreating,
    updateWorkspace,
    isUpdating,
    deleteWorkspace,
    isDeleting,
  };
}; 