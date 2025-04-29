import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService } from '@/services';
import { TCreateTask, TUpdateTask } from '@/validations'; // Assuming these types are exported
import { ITask } from '@/types';

// Define structure for createTask mutation input
interface CreateTaskMutationInput {
  params: {
    spaceId: string;
    listId: string
  };
  data: TCreateTask;
}

// Define structure for updateTask mutation input
interface UpdateTaskMutationInput {
  taskId: string;
  data: TUpdateTask;
}

// Hook for Task Mutations (Create, Update, Delete)
export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  // Helper to invalidate relevant task list queries
  const invalidateTaskListQueries = (
    params: CreateTaskMutationInput['params'] // Use the same params structure
  ) => {
    // Invalidate the specific list query where the task was added/modified/deleted
    queryClient.invalidateQueries({
      queryKey: [
        taskService.getAllTasks.name,
        { spaceId: params.spaceId },
        // We might need to invalidate across different filters, or just the default/no filter
      ],
      // Consider `refetchType: 'none'` if you only want to mark as stale
    });
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
      invalidateTaskListQueries(variables.params);
      // Optionally, update the specific task list cache if needed
    },
    onError: error => {
      toast.error(error.message || 'Failed to create task.');
    },
  });

  // --- Update Task Mutation ---
  const { mutate: updateTask, isPending: isUpdatingTask } = useMutation<
    ITask,
    Error,
    UpdateTaskMutationInput
  >({
    mutationKey: [taskService.updateTask.name],
    mutationFn: ({ taskId, data }) => taskService.updateTask({ taskId }, data),
    onSuccess: (updatedTask, variables) => {
      toast.success(`Task "${updatedTask.name}" updated successfully!`);

      // Invalidate the specific task query
      queryClient.invalidateQueries({
        queryKey: [taskService.getTaskById.name, variables.taskId],
      });
      // Update the specific task query data in the cache
      queryClient.setQueryData(
        [taskService.getTaskById.name, variables.taskId],
        updatedTask
      );

      // Invalidate relevant task list queries (need context like workspace/space ID)
      // This part is tricky without knowing the context where update is called.
      // We might need to pass context to the mutation call or have a broader invalidation.
      // Example: queryClient.invalidateQueries({ queryKey: [taskService.getAllTasks.name] }); // Broad invalidation
      // OR pass context: invalidateTaskListQueries({ workspaceId: ..., spaceId: ... });
    },
    onError: error => {
      toast.error(error.message || 'Failed to update task.');
    },
  });

  // --- Delete Task Mutation ---
  const { mutate: deleteTask, isPending: isDeletingTask } = useMutation<
    void,
    Error,
    string // Expects taskId
  >({
    mutationKey: [taskService.deleteTask.name],
    mutationFn: taskId => taskService.deleteTask({ taskId }), // Correctly accept the string variable
    onSuccess: (_, taskId) => {
      toast.success('Task deleted successfully!');

      // Remove the specific task query from cache
      queryClient.removeQueries({
        queryKey: [taskService.getTaskById.name, taskId],
      });

      // Invalidate relevant task list queries (same challenge as update)
      // Example: queryClient.invalidateQueries({ queryKey: [taskService.getAllTasks.name] }); // Broad invalidation
    },
    onError: error => {
      toast.error(error.message || 'Failed to delete task.');
    },
  });

  return {
    createTask,
    isCreatingTask,
    updateTask,
    isUpdatingTask,
    deleteTask,
    isDeletingTask,
  };
};
