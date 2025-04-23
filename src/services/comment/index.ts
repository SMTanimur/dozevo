import { api } from '@/api';
import { IComment, ICommentListResponse } from '@/types';
import {
  createCommentSchema,
  updateCommentSchema,
  addReactionSchema,
} from '@/validations';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
type CreateCommentInput = z.infer<typeof createCommentSchema>;
type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
type AddReactionInput = z.infer<typeof addReactionSchema>;

// Define the base API path function
const getBasePath = (taskId: string) => `/v1/tasks/${taskId}/comments`;
const getDetailPath = (taskId: string, commentId: string) =>
  `${getBasePath(taskId)}/${commentId}`;
const getReactionsPath = (taskId: string, commentId: string) =>
  `${getDetailPath(taskId, commentId)}/reactions`;

export class CommentService {
  async getAllComments(taskId: string): Promise<IComment[]> {
    try {
      // Assuming API returns { data: Comment[], total: number }
      const response = await api.get<ICommentListResponse>(getBasePath(taskId));
      return response.data.data; // Return the array of comments
    } catch (error) {
      console.error(`Failed to fetch comments for task ${taskId}:`, error);
      throw error;
    }
  }

  async getCommentById(taskId: string, commentId: string): Promise<IComment> {
    try {
      const response = await api.get<IComment>(getDetailPath(taskId, commentId));
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch comment ${commentId}:`, error);
      throw error;
    }
  }

  async createComment(
    taskId: string,
    data: CreateCommentInput,
  ): Promise<IComment> {
    try {
      createCommentSchema.parse(data);
      const response = await api.post<IComment>(getBasePath(taskId), data);
      return response.data;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  }

  async updateComment(
    taskId: string,
    commentId: string,
    data: UpdateCommentInput,
  ): Promise<IComment> {
    try {
      updateCommentSchema.parse(data);
      const response = await api.patch<IComment>(
        getDetailPath(taskId, commentId),
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update comment ${commentId}:`, error);
      throw error;
    }
  }

  async deleteComment(taskId: string, commentId: string): Promise<void> {
    try {
      await api.delete(getDetailPath(taskId, commentId));
    } catch (error) {
      console.error(`Failed to delete comment ${commentId}:`, error);
      throw error;
    }
  }

  // --- Reactions ---

  async addReaction(
    taskId: string,
    commentId: string,
    data: AddReactionInput,
  ): Promise<IComment> {
    try {
      addReactionSchema.parse(data);
      const response = await api.post<IComment>(
        getReactionsPath(taskId, commentId),
        data,
      );
      return response.data; // Return updated comment with new reaction
    } catch (error) {
      console.error(`Failed to add reaction to comment ${commentId}:`, error);
      throw error;
    }
  }

  async removeReaction(
    taskId: string,
    commentId: string,
    data: AddReactionInput, // API uses DELETE with body to specify emoji
  ): Promise<IComment> {
    try {
      addReactionSchema.parse(data); // Validate emoji exists
      const response = await api.delete<IComment>(
        getReactionsPath(taskId, commentId),
        { data }, // Axios delete with body
      );
      return response.data; // Return updated comment
    } catch (error) {
      console.error(`Failed to remove reaction from comment ${commentId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const commentService = new CommentService(); 