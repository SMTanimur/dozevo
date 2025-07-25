import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { listService } from '@/services'; // Adjust path if needed
import { TCreateStatus, TUpdateStatus } from '@/validations/status';
import { IStatusDefinition } from '@/types/status';

interface StatusMutationParams {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

// --- Create Status ---
type CreateStatusVariables = StatusMutationParams & { data: TCreateStatus };

export const useCreateStatus = (
  options?: UseMutationOptions<
    IStatusDefinition,
    AxiosError,
    CreateStatusVariables
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<IStatusDefinition, AxiosError, CreateStatusVariables>({
    mutationFn: ({
      workspaceId,
      spaceId,
      listId,
      data,
    }: CreateStatusVariables) =>
      listService.createStatus(workspaceId, spaceId, listId, data),
    ...options,
    onSuccess: (
      data: IStatusDefinition,
      variables: CreateStatusVariables,
      context
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          listService.getStatuses.name,
          variables.workspaceId,
          variables.spaceId,
          variables.listId,
        ],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

// --- Update Status ---
type UpdateStatusVariables = StatusMutationParams & {
  statusId: string;
  data: Partial<TUpdateStatus>;
};

export const useUpdateStatus = (
  options?: UseMutationOptions<
    IStatusDefinition,
    AxiosError,
    UpdateStatusVariables
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<IStatusDefinition, AxiosError, UpdateStatusVariables>({
    mutationFn: ({
      workspaceId,
      spaceId,
      listId,
      statusId,
      data,
    }: UpdateStatusVariables) =>
      listService.updateStatus(workspaceId, spaceId, listId, statusId, data),
    ...options,
    onSuccess: (
      data: IStatusDefinition,
      variables: UpdateStatusVariables,
      context
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          listService.getStatuses.name,
          variables.workspaceId,
          variables.spaceId,
          variables.listId,
        ],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

// --- Delete Status ---
type DeleteStatusVariables = StatusMutationParams & { statusId: string };

export const useDeleteStatus = (
  options?: UseMutationOptions<void, AxiosError, DeleteStatusVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, DeleteStatusVariables>({
    mutationFn: ({
      workspaceId,
      spaceId,
      listId,
      statusId,
    }: DeleteStatusVariables) =>
      listService.deleteStatus(workspaceId, spaceId, listId, statusId),
    ...options,
    onSuccess: (data: void, variables: DeleteStatusVariables, context) => {
      queryClient.invalidateQueries({
        queryKey: [
          listService.getStatuses.name,
          variables.workspaceId,
          variables.spaceId,
          variables.listId,
        ],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
