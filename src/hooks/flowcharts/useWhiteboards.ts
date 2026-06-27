import { flowchartsService } from '@/services';
import { IFlowchart } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseGetWhiteboardsParams {
  workspaceId: string;
  spaceId?: string;
  listId?: string;
}

export const useGetWhiteboards = (params: UseGetWhiteboardsParams, options?: { enabled?: boolean }) => {
  const { workspaceId, spaceId, listId } = params;

  return useQuery<IFlowchart[], Error>({
    queryKey: ['whiteboards', workspaceId, spaceId, listId],
    queryFn: () => {
      if (listId) {
        return flowchartsService.getFlowchartsByList(workspaceId, listId);
      }
      if (spaceId) {
        return flowchartsService.getFlowchartsBySpace(workspaceId, spaceId);
      }
      throw new Error('Either spaceId or listId must be provided');
    },
    enabled:
      !!workspaceId &&
      (!!spaceId || !!listId) &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};

export const useGetWhiteboardById = (workspaceId: string, id: string, options?: { enabled?: boolean }) => {
  return useQuery<IFlowchart, Error>({
    queryKey: ['whiteboard', id],
    queryFn: () => flowchartsService.getFlowchartById(workspaceId, id),
    enabled: !!workspaceId && !!id && (options?.enabled !== undefined ? options.enabled : true),
  });
};

export const useWhiteboardMutations = () => {
  const queryClient = useQueryClient();

  const createWhiteboardMutation = useMutation<
    IFlowchart,
    Error,
    { workspaceId: string; data: Partial<IFlowchart> }
  >({
    mutationFn: ({ workspaceId, data }) => flowchartsService.createFlowchart(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whiteboards'] });
    },
  });

  const updateWhiteboardMutation = useMutation<
    IFlowchart,
    Error,
    { workspaceId: string; id: string; data: Partial<IFlowchart> }
  >({
    mutationFn: ({ workspaceId, id, data }) =>
      flowchartsService.updateFlowchart(workspaceId, id, data),
    onSuccess: (updatedWb) => {
      queryClient.invalidateQueries({ queryKey: ['whiteboards'] });
      queryClient.invalidateQueries({ queryKey: ['whiteboard', updatedWb._id] });
    },
  });

  const deleteWhiteboardMutation = useMutation<
    { message: string },
    Error,
    { workspaceId: string; id: string }
  >({
    mutationFn: ({ workspaceId, id }) => flowchartsService.deleteFlowchart(workspaceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whiteboards'] });
    },
  });

  return {
    createWhiteboard: createWhiteboardMutation.mutateAsync,
    isCreatingWhiteboard: createWhiteboardMutation.isPending,
    updateWhiteboard: updateWhiteboardMutation.mutateAsync,
    isUpdatingWhiteboard: updateWhiteboardMutation.isPending,
    deleteWhiteboard: deleteWhiteboardMutation.mutateAsync,
    isDeletingWhiteboard: deleteWhiteboardMutation.isPending,
  };
};
