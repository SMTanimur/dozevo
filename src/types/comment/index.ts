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


export interface ICommentContentBlock {
  type: string; // e.g., 'text', 'mention'
  text?: string; // Make text optional
}

export interface IReaction {
  user: ITaskUser; // Use the existing DTO for populated user
  emoji: string;
}

export interface IComment {
  _id: string;
  task: string; // Task ID
  user: ITaskUser; // Populated user who created the comment
  comment_text?: string; // Optional legacy text content
  comment_blocks?: CommentContentBlock[]; // Structured content blocks
  resolved: boolean;
  assignee?: ITaskUser | null; // User assigned to resolve the comment
  assigned_by?: ITaskUser | null; // User who assigned the comment
  createdAt: Date;
  updatedAt: Date;
  reactions?: IReaction[]; // Array of reactions
}

export interface ICommentList {
  // Renamed from CommentList
  data: IComment[];
  total: number;
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