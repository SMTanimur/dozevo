import { z } from 'zod';
import {
  commentSchema,
  reactionSchema,
  commentContentBlockSchema,
} from '@/validations/comment';
import { ITaskUser } from '../task';

// Type derived from the Zod schema
export type Reaction = z.infer<typeof reactionSchema>;

// Type derived from the Zod schema
export type CommentContentBlock = z.infer<typeof commentContentBlockSchema>;

// Type derived from the Zod schema
export type Comment = z.infer<typeof commentSchema>;


// Interface for a single reaction
export interface IReaction {
  emoji: string;
  users: ITaskUser[]; // Array of user IDs who reacted
  count: number;
}

// Main Comment Interface
export interface IComment {
  _id: string;
  content: string;
  taskId: string; // ID of the task this comment belongs to
  author: ITaskUser // Basic author info
  reactions: IReaction[];
  createdAt: string; // Assuming ISO date string
  updatedAt: string; // Assuming ISO date string
  // Add other potential fields like mentions, parentCommentId, etc. if needed
}

// Interface for the response when fetching a list of comments
export interface ICommentListResponse {
  data: IComment[];
  total: number;
  // Add pagination fields if applicable (e.g., page, limit)
} 
// export type CreateCommentInput = z.infer<typeof createCommentSchema>;
// export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
// export type AddReactionInput = z.infer<typeof addReactionSchema>; 