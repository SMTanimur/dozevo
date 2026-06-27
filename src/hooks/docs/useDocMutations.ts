import { docsService } from '@/services';
import { IDoc } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDocMutations = () => {
  const queryClient = useQueryClient();

  const createDocMutation = useMutation<
    IDoc,
    Error,
    { workspaceId: string; data: Partial<IDoc> }
  >({
    mutationFn: ({ workspaceId, data }) => docsService.createDoc(workspaceId, data),
    onSuccess: (newDoc) => {
      // Invalidate both space-level and list-level doc lists
      queryClient.invalidateQueries({ queryKey: ['docs'] });
    },
  });

  const updateDocMutation = useMutation<
    IDoc,
    Error,
    { workspaceId: string; docId: string; data: Partial<IDoc> }
  >({
    mutationFn: ({ workspaceId, docId, data }) =>
      docsService.updateDoc(workspaceId, docId, data),
    onSuccess: (updatedDoc) => {
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      queryClient.invalidateQueries({ queryKey: ['doc', updatedDoc._id] });
    },
  });

  const deleteDocMutation = useMutation<
    { message: string },
    Error,
    { workspaceId: string; docId: string }
  >({
    mutationFn: ({ workspaceId, docId }) => docsService.deleteDoc(workspaceId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docs'] });
    },
  });

  return {
    createDoc: createDocMutation.mutateAsync,
    isCreatingDoc: createDocMutation.isPending,
    updateDoc: updateDocMutation.mutateAsync,
    isUpdatingDoc: updateDocMutation.isPending,
    deleteDoc: deleteDocMutation.mutateAsync,
    isDeletingDoc: deleteDocMutation.isPending,
  };
};
