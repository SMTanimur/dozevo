import { taskService } from "@/services";
import { TaskListResponse } from "@/types";
import { TGetTasksFilter } from "@/validations"; // Assuming TGetTasksFilter is the validated type
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksParams {
  workspaceId: string;
  spaceId: string;
  listId?: string;
  filters?: TGetTasksFilter;
  options?: { enabled?: boolean };
}

/**
 * Hook to fetch tasks within a specific context (space or folder).
 * Uses taskService.getAllTasks.name and context IDs/filters as the query key.
 * @param params - Context IDs (workspaceId, spaceId, folderId?), filters, and options.
 */
export const useGetTasks = (params: UseGetTasksParams) => {
  const { workspaceId, spaceId, listId, filters, options } = params;

  // Construct query key including all relevant identifiers and filters
  const queryKey = [
    taskService.getAllTasks.name,
    { workspaceId, spaceId, listId },
    filters ?? {},
  ];

  return useQuery<TaskListResponse, Error>({
    queryKey,
    queryFn: () =>
      taskService.getAllTasks({
        workspaceId,
        spaceId,
        listId,
        filters,
      }),
    // Ensure context IDs are provided and respect enabled option
    enabled:
      !!workspaceId &&
      !!spaceId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
}; 