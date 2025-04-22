import { taskService } from "@/services";
import { Task } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific task by its ID.
 * Uses taskService.getTaskById.name as part of the query key.
 * Note: Assumes the service handles context verification based on ID alone.
 * @param taskId - The ID of the task to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetTask = (taskId: string, options?: { enabled?: boolean }) => {
  return useQuery<Task, Error>({
    // Use function name and ID for the query key
    queryKey: [taskService.getTaskById.name, taskId],
    queryFn: () => taskService.getTaskById(taskId),
    // Ensure taskId is provided and respect enabled option
    enabled: !!taskId && (options?.enabled !== undefined ? options.enabled : true),
  });
}; 