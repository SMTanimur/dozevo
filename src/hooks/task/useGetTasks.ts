import { taskService } from '@/services';
import { TaskListResponse } from '@/types';
import { TGetTasksFilter } from '@/validations'; // Assuming TGetTasksFilter is the validated type
import { useQuery } from '@tanstack/react-query';

interface UseGetTasksParams {
  spaceId: string;
  listId?: string;
  filters?: TGetTasksFilter;
}

interface UseGetTasksOptions {
  enabled?: boolean;
}

// Export the query key generator
export const getTasksQueryKey = (
  params: UseGetTasksParams,
  filters?: TGetTasksFilter
) => [
  taskService.getAllTasks.name, // Use function name for uniqueness
  { spaceId: params.spaceId, listId: params.listId }, // Context IDs
  filters ?? {}, // Include filters in the key
];

/**
 * Hook to fetch tasks within a specific context (space or folder).
 * Uses taskService.getAllTasks.name and context IDs/filters as the query key.
 * @param params - Context IDs (workspaceId, spaceId, folderId?)
 * @param filters - Optional task filters.
 * @param options - Optional query options like enabled.
 */
export const useGetTasks = (
  params: UseGetTasksParams,
  filters?: TGetTasksFilter,
  options?: UseGetTasksOptions
) => {
  const { spaceId, listId } = params;

  const queryKey = getTasksQueryKey(params, filters);

  return useQuery<TaskListResponse, Error>({
    queryKey,
    queryFn: () =>
      taskService.getAllTasks({
        spaceId,
        listId,
        filters,
      }),
    enabled:
      !!spaceId && (options?.enabled !== undefined ? options.enabled : true),
  });
};
