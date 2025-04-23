import { z } from 'zod';

// Schema for Tag object returned by the API
export const tagSchema = z.object({
  _id: z.string({ required_error: 'Tag ID is required' }),
  name: z.string({ required_error: 'Tag name is required' }).min(1, 'Tag name cannot be empty'),
  color: z.string().optional(),
  workspace: z.string({ required_error: 'Workspace ID is required' }),
  // Add other relevant fields if needed
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a tag (example)
export const createTagSchema = z.object({
    name: z.string({ required_error: 'Tag name is required' }).min(1, 'Tag name cannot be empty'),
    color: z.string().optional(),
    workspace: z.string({ required_error: 'Workspace ID is required' }),
});

export type TCreateTag = z.infer<typeof createTagSchema>;

// Schema for updating a tag (example)
export const updateTagSchema = z.object({
    name: z.string().min(1, 'Tag name cannot be empty').optional(),
    color: z.string().optional(),
}); 


export type TUpdateTag = z.infer<typeof updateTagSchema>;