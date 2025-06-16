import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commentService } from '@/services';
import { IComment } from '@/types';
import {
  TCreateComment,
  TUpdateComment,
  TAddReaction,
} from '@/validations'; // Assuming these types are exported

// --- Input Types for Mutations ---
interface CreateCommentMutationInput {
  taskId: string;
  data: TCreateComment;
}

interface UpdateCommentMutationInput {
  taskId: string;
  commentId: string;
  data: TUpdateComment;
}

interface DeleteCommentMutationInput {
  taskId: string;
  commentId: string;
}

interface ReactionMutationInput {
  taskId: string;
  commentId: string;
  data: TAddReaction;
}

// --- Hook for Comment Mutations ---
export const useCommentMutations = () => {
  const queryClient = useQueryClient();

  // Helper to invalidate comment list and specific comment queries
  const invalidateCommentQueries = (taskId: string, commentId?: string) => {
    // Invalidate the list of comments for the task
    queryClient.invalidateQueries({
      queryKey: [commentService.getAllComments.name, taskId],
    });
    // Invalidate the specific comment query if commentId is provided
    if (commentId) {
      queryClient.invalidateQueries({
        queryKey: [commentService.getCommentById.name, taskId, commentId],
      });
    }
  };

  // --- Create Comment ---
  const { mutate: createComment, isPending: isCreatingComment } = useMutation<
    IComment,
    Error,
    CreateCommentMutationInput
  >({
    mutationKey: [commentService.createComment.name],
    mutationFn: ({ taskId, data }) => commentService.createComment(taskId, data),
    onSuccess: (newComment, variables) => {
      toast.success('Comment added successfully!');
      invalidateCommentQueries(variables.taskId);
      // Optionally, update the comment list cache
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add comment.');
    },
  });

  // --- Update Comment ---
  const { mutate: updateComment, isPending: isUpdatingComment } = useMutation<
    IComment,
    Error,
    UpdateCommentMutationInput
  >({
    mutationKey: [commentService.updateComment.name],
    mutationFn: ({ taskId, commentId, data }) =>
      commentService.updateComment(taskId, commentId, data),
    onSuccess: (updatedComment, variables) => {

      invalidateCommentQueries(variables.taskId, variables.commentId);
      // Update the specific comment cache
      queryClient.setQueryData<
        IComment
      >(
        [commentService.getCommentById.name, variables.taskId, variables.commentId],
        updatedComment,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update comment.');
    },
  });

  // --- Delete Comment ---
  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation<
    void,
    Error,
    DeleteCommentMutationInput
  >({
    mutationKey: [commentService.deleteComment.name],
    mutationFn: ({ taskId, commentId }) =>
      commentService.deleteComment(taskId, commentId),
    onSuccess: (_, variables) => {
 
      invalidateCommentQueries(variables.taskId, variables.commentId);
      // Remove the specific comment from cache
      queryClient.removeQueries({
        queryKey: [
          commentService.getCommentById.name,
          variables.taskId,
          variables.commentId,
        ],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete comment.');
    },
  });

  // --- Add Reaction ---
  const { mutate: addReaction, isPending: isAddingReaction } = useMutation<
    IComment,
    Error,
    ReactionMutationInput
  >({
    mutationKey: [commentService.addReaction.name],
    mutationFn: ({ taskId, commentId, data }) =>
      commentService.addReaction(taskId, commentId, data),
    onSuccess: (updatedComment, variables) => {
      invalidateCommentQueries(variables.taskId, variables.commentId);
      // Update the specific comment cache
      queryClient.setQueryData<
        IComment
      >(
        [commentService.getCommentById.name, variables.taskId, variables.commentId],
        updatedComment,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add reaction.');
    },
  });

  // --- Remove Reaction ---
  const { mutate: removeReaction, isPending: isRemovingReaction } = useMutation<
    IComment,
    Error,
    ReactionMutationInput
  >({
    mutationKey: [commentService.removeReaction.name],
    mutationFn: ({ taskId, commentId, data }) =>
      commentService.removeReaction(taskId, commentId, data),
    onSuccess: (updatedComment, variables) => {
      invalidateCommentQueries(variables.taskId, variables.commentId);
      // Update the specific comment cache
      queryClient.setQueryData<
        IComment
      >(
        [commentService.getCommentById.name, variables.taskId, variables.commentId],
        updatedComment,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove reaction.');
    },
  });

  return {
    createComment,
    isCreatingComment,
    updateComment,
    isUpdatingComment,
    deleteComment,
    isDeletingComment,
    addReaction,
    isAddingReaction,
    removeReaction,
    isRemovingReaction,
  };
}; 