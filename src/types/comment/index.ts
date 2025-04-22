import { z } from 'zod';
import {
  commentSchema,
  reactionSchema,
  commentContentBlockSchema,
} from '@/validations/comment';

// Type derived from the Zod schema
export type Reaction = z.infer<typeof reactionSchema>;

// Type derived from the Zod schema
export type CommentContentBlock = z.infer<typeof commentContentBlockSchema>;

// Type derived from the Zod schema
export type Comment = z.infer<typeof commentSchema>;

// Type for the list response structure
export type CommentListResponse = {
  data: Comment[];
  total: number;
};

// export type CreateCommentInput = z.infer<typeof createCommentSchema>;
// export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
// export type AddReactionInput = z.infer<typeof addReactionSchema>; 