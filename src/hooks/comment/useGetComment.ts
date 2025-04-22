import { commentService } from "@/services";
import { Comment } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific comment by its ID and task ID.
 * Uses commentService.getCommentById.name, taskId, and commentId as the query key.
 * @param taskId - The ID of the task the comment belongs to.
 * @param commentId - The ID of the comment to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetComment = (
  taskId: string,
  commentId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<Comment, Error>({
    // Use function name, taskId, and commentId for the query key
    queryKey: [commentService.getCommentById.name, taskId, commentId],
    queryFn: () => commentService.getCommentById(taskId, commentId),
    // Ensure IDs are provided and respect enabled option
    enabled:
      !!taskId &&
      !!commentId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
}; 