import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { listService } from '@/services'; // Adjust path if needed
import { TCreateStatus, TUpdateStatus } from '@/validations/status';
import { TStatus } from '@/types/status';
import { getStatusesQueryKey } from './useGetStatuses'; // Import query key generator

interface StatusMutationParams {
  workspaceId: string;
  spaceId: string;
  listId: string;
}

// --- Create Status ---
type CreateStatusVariables = StatusMutationParams & { data: TCreateStatus };

export const useCreateStatus = (
  options?: UseMutationOptions<TStatus, AxiosError, CreateStatusVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation<TStatus, AxiosError, CreateStatusVariables>({
    mutationFn: ({
      workspaceId,
      spaceId,
      listId,
      data,
    }: CreateStatusVariables) =>
      listService.createStatus(workspaceId, spaceId, listId, data),
    ...options,
    onSuccess: (data: TStatus, variables: CreateStatusVariables, context) => {
      queryClient.invalidateQueries({
        queryKey: getStatusesQueryKey({
          workspaceId: variables.workspaceId,
          spaceId: variables.spaceId,
          listId: variables.listId,
        }),
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
  options?: UseMutationOptions<TStatus, AxiosError, UpdateStatusVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation<TStatus, AxiosError, UpdateStatusVariables>({
    mutationFn: ({
      workspaceId,
      spaceId,
      listId,
      statusId,
      data,
    }: UpdateStatusVariables) =>
      listService.updateStatus(workspaceId, spaceId, listId, statusId, data),
    ...options,
    onSuccess: (data: TStatus, variables: UpdateStatusVariables, context) => {
      queryClient.invalidateQueries({
        queryKey: getStatusesQueryKey({
          workspaceId: variables.workspaceId,
          spaceId: variables.spaceId,
          listId: variables.listId,
        }),
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
        queryKey: getStatusesQueryKey({
          workspaceId: variables.workspaceId,
          spaceId: variables.spaceId,
          listId: variables.listId,
        }),
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
