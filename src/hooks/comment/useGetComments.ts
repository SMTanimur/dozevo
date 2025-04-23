import { commentService } from "@/services";
import { IComment } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all comments for a specific task.
 * Uses commentService.getAllComments.name and taskId as the query key.
 * @param taskId - The ID of the task whose comments are to be fetched.
 * @param options - Optional React Query query options.
 */
export const useGetComments = (taskId: string, options?: { enabled?: boolean }) => {
  return useQuery<IComment[], Error>({
    // Use function name and taskId for the query key
    queryKey: [commentService.getAllComments.name, taskId],
    queryFn: () => commentService.getAllComments(taskId),
    // Ensure taskId is provided and respect enabled option
    enabled: !!taskId && (options?.enabled !== undefined ? options.enabled : true),
  });
}; 