import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService } from '@/services';
import { TCreateTask, TUpdateTask } from '@/validations'; // Assuming these types are exported
import { ITask, TaskListResponse } from '@/types'; // Removed IStatusDefinition
import { getTasksQueryKey } from './useGetTasks'; // Import task list query key generator
import { getStatusesQueryKey } from '../list/useGetStatuses'; // Import status list query key generator

// Define structure for createTask mutation input
interface BaseParams {
  workspaceId: string; // Needed for status cache key
  spaceId: string;
  listId: string;
}

interface CreateTaskMutationInput {
  params: Pick<BaseParams, 'spaceId' | 'listId'>; // Only need space/list for create path
  data: TCreateTask;
}

interface UpdateTaskMutationInput {
  taskId: string;
  data: TUpdateTask;
  // Add context params needed for cache invalidation/optimistic update
  params: BaseParams;
}

interface DeleteTaskMutationInput {
  taskId: string;
  params: BaseParams;
}

interface UploadAttachmentMutationInput {
  taskId: string;
  files: File[]; // Changed from file: File to files: File[]
  params: BaseParams;
}

// Define structure for input data
// Type for the reorder input data (can be defined here or imported)
interface ReorderTasksInput {
  listId: string;
  orderedTaskIds: string[];
}

// Type for reorder mutation variables (includes context for invalidation)
interface ReorderTasksMutationInput extends ReorderTasksInput {
  params: BaseParams; // Pass workspaceId, spaceId, listId for invalidation
}

// Hook for Task Mutations (Create, Update, Delete, Reorder)
export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  // Helper to invalidate relevant task list queries
  const invalidateRelevantQueries = (params: BaseParams, taskId?: string) => {
    // Invalidate the task list query for the specific context
    queryClient.invalidateQueries({
      queryKey: getTasksQueryKey({
        spaceId: params.spaceId,
        listId: params.listId,
      }),
    });
    // Invalidate the status query for potential count updates
    queryClient.invalidateQueries({
      queryKey: getStatusesQueryKey(params),
    });
    // Invalidate the specific task query if ID provided
    if (taskId) {
      queryClient.invalidateQueries({
        queryKey: [taskService.getTaskById.name, taskId],
      });
    }
  };

  // --- Create Task Mutation ---
  const { mutate: createTask, isPending: isCreatingTask } = useMutation<
    ITask,
    Error,
    CreateTaskMutationInput
  >({
    mutationKey: [taskService.createTask.name],
    mutationFn: ({ params, data }) => taskService.createTask(params, data),
    onSuccess: (newTask, variables) => {
      toast.success(`Task "${newTask.name}" created successfully!`);
      // Invalidate task list and statuses for the context
      queryClient.invalidateQueries({
        queryKey: getTasksQueryKey({
          spaceId: variables.params.spaceId,
          listId: variables.params.listId,
        }),
      });
      // We might need workspaceId for status invalidation if getStatusesQueryKey needs it
      // queryClient.invalidateQueries({ queryKey: getStatusesQueryKey(...) });
    },
    onError: error => {
      toast.error(`Failed to create task: ${(error as Error).message}`);
    },
  });

  // --- Update Task Mutation (with Optimistic Update - Invalidate on Settled Strategy) ---
  const { mutate: updateTask, isPending: isUpdatingTask } = useMutation<
    ITask, // Return type
    Error, // Error type
    UpdateTaskMutationInput, // Variables type
    { previousTasksResponse?: TaskListResponse } // Context type from onMutate
  >({
    mutationKey: [taskService.updateTask.name],
    mutationFn: ({ taskId, data }) => taskService.updateTask({ taskId }, data),

    onMutate: async (variables: UpdateTaskMutationInput) => {
      // Destructure only necessary variables
      const { params } = variables;
      const taskListQueryKey = getTasksQueryKey({
        spaceId: params.spaceId,
        listId: params.listId,
      });
      const specificTaskQueryKey = [
        taskService.getTaskById.name,
        variables.taskId,
      ];
      const statusQueryKey = getStatusesQueryKey(params);

      // Cancel any outgoing refetches (still useful)
      await queryClient.cancelQueries({ queryKey: taskListQueryKey });
      await queryClient.cancelQueries({ queryKey: specificTaskQueryKey });
      await queryClient.cancelQueries({ queryKey: statusQueryKey });

      // Snapshot previous task list value for potential rollback
      const previousTasksResponse =
        queryClient.getQueryData<TaskListResponse>(taskListQueryKey);

      // --- REMOVED OPTIMISTIC UPDATE LOGIC ---
      // The component now handles the immediate UI update via local state.

      // Return snapshot for potential rollback on error
      return { previousTasksResponse };
    },

    onError: (err, variables, context) => {
      toast.error(`Update failed: ${(err as Error).message}`);
      // Rollback task list cache if snapshot exists
      // We still need rollback in case the local state update succeeded
      // but the API call failed.
      if (context?.previousTasksResponse) {
        const taskListQueryKey = getTasksQueryKey({
          spaceId: variables.params.spaceId,
          listId: variables.params.listId,
        });
        queryClient.setQueryData(
          taskListQueryKey,
          context.previousTasksResponse
        );
        // Note: This rollback might cause a flicker if the API fails,
        // as the UI reverts from the temporary local state back to the
        // previous server state. This is a tradeoff of the manual local state approach.
      }
      // onSettled will still invalidate to be sure.
    },

    onSettled: (data, error, variables) => {
      console.log(
        'Invalidating queries in onSettled (after local state update)'
      );
      invalidateRelevantQueries(variables.params, variables.taskId);
    },
  });

  // --- Delete Task Mutation ---
  const { mutate: deleteTask, isPending: isDeletingTask } = useMutation<
    void,
    Error,
    DeleteTaskMutationInput
  >({
    mutationKey: [taskService.deleteTask.name],
    mutationFn: ({ taskId }) => taskService.deleteTask({ taskId }), // API call only needs taskId
    onSuccess: (_, variables) => {
  
      // Remove the specific task query from cache
      queryClient.removeQueries({
        queryKey: [taskService.getTaskById.name, variables.taskId],
      });
      // Invalidate task list and statuses
      invalidateRelevantQueries(variables.params);
    },
    onError: error => {
      toast.error(`Failed to delete task: ${(error as Error).message}`);
    },
  });

  // --- Reorder Tasks Mutation ---
  const { mutate: reorderTasks, isPending: isReorderingTasks } = useMutation<
    { message: string }, // Success response type
    Error, // Error type
    ReorderTasksMutationInput // Variables type
  >({
    mutationKey: [taskService.reorderTasks.name],
    mutationFn: data => taskService.reorderTasks(data), // Pass data directly
    onSuccess: (data, variables) => {
    
      // Invalidate the task list for the specific context
      // We only need listId and spaceId for task invalidation
      invalidateRelevantQueries({
        workspaceId: variables.params.workspaceId,
        spaceId: variables.params.spaceId,
        listId: variables.params.listId,
      });
    },
    onError: error => {
      toast.error(`Failed to reorder tasks: ${(error as Error).message}`);
      // Consider if rollback is needed/possible for reordering
    },
  });

  // --- Upload Attachment Mutation ---
  const { mutate: uploadAttachment, isPending: isUploadingAttachment } =
    useMutation<ITask, Error, UploadAttachmentMutationInput>({
      mutationKey: [taskService.uploadAttachment.name],
      mutationFn: (
        { taskId, files } // Destructure files (array)
      ) => taskService.uploadAttachment({ taskId, files }), // Pass files array
      onSuccess: (updatedTask, variables) => {
  
        invalidateRelevantQueries(variables.params, variables.taskId);
        queryClient.setQueryData(
          [taskService.getTaskById.name, variables.taskId],
          updatedTask
        );
      },
      onError: (error, variables) => {
        toast.error(
          `Failed to upload attachment(s) for task ${variables.taskId}: ${
            // Updated message
            (error as Error).message
          }`
        );
      },
    });

  return {
    createTask,
    isCreatingTask,
    updateTask,
    isUpdatingTask,
    deleteTask,
    isDeletingTask,
    reorderTasks, // Expose the new mutation
    isReorderingTasks,
    uploadAttachment,
    isUploadingAttachment,
  };
};
