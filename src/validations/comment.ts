import { z } from 'zod';
import { userSchema } from './user'; // Import user schema

// Schema for Reaction subdocument (matching ReactionResponseDto)
export const reactionSchema = z.object({
  user: userSchema, // Expecting populated user
  emoji: z.string({ required_error: 'Emoji is required' }),
});

// Schema for Comment Content Block (matching CommentContentBlockResponseDto)
export const commentContentBlockSchema = z.object({
  type: z.string({ required_error: 'Block type is required' }),
  text: z.string().optional(),
});

// Schema for the Comment object returned by the API (matching CommentResponseDto)
export const commentSchema = z.object({
  _id: z.string({ required_error: 'Comment ID is required' }),
  task: z.string({ required_error: 'Task ID is required' }),
  user: userSchema, // Expecting populated user
  comment_text: z.string().optional(), // Optional if blocks are primary
  comment_blocks: z.array(commentContentBlockSchema).optional(),
  resolved: z.boolean().default(false),
  assignee: userSchema.nullable().optional(), // Optional populated user
  assigned_by: userSchema.nullable().optional(), // Optional populated user
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  reactions: z.array(reactionSchema).optional(),
});

// Schema for creating a comment (matching CreateCommentDto)
export const createCommentSchema = z.object({
  contentText: z
    .string({ required_error: 'Comment text is required' })
    .min(1, 'Comment cannot be empty')
    .trim(),
  // Content blocks might be part of the DTO, add if needed
  // contentBlocks: z.array(commentContentBlockSchema.pick({ type: true, text: true })).optional(),
});

// Schema for updating a comment (matching UpdateCommentDto)
export const updateCommentSchema = z
  .object({
    contentText: z.string().min(1, 'Comment cannot be empty').trim().optional(),
    // contentBlocks: z.array(commentContentBlockSchema.pick({ type: true, text: true })).optional(),
    resolved: z.boolean().optional(),
    assignee: z.string().uuid('Invalid assignee user ID').nullable().optional(), // Send User ID or null
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Schema for adding a reaction (based on AddReactionDto)
export const addReactionSchema = z.object({
  emoji: z
    .string({ required_error: 'Emoji is required for reaction' })
    .min(1, 'Emoji cannot be empty'),
    // Add specific emoji validation if desired
}); 