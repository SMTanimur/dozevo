import { z } from 'zod';
import { statusDefinitionSchema } from './space';

// Basic schema for Folder object returned by the API
export const listSchema = z.object({
  _id: z.string({ required_error: 'Folder ID is required' }),
  name: z.string({ required_error: 'Folder name is required' }).min(1, 'Folder name cannot be empty'),
  workspace: z.string({ required_error: 'Workspace ID is required' }), // Assuming workspace ID is included
  space: z.string({ required_error: 'Space ID is required' }), // Assuming space ID is included
  archived: z.boolean().default(false),
  // Add other relevant fields like color, orderindex, etc., if needed
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a folder (matching CreateFolderDto)
export const createlistSchema = z.object({
  name: z
    .string({ required_error: 'Folder name is required' })
    .min(1, 'Folder name cannot be empty')
    .trim(),
  space: z.string({ required_error: 'Space ID is required' }),
  private: z.boolean(),

  // Add workspace if needed by API endpoint
});

export type TCreateList = z.infer<typeof createlistSchema>;

// Schema for updating a folder (matching UpdateFolderDto)
export const updatelistSchema = z
  .object({
    name: z.string().min(1, 'Folder name cannot be empty').trim().optional(),
    archived: z.boolean().optional(),
    private: z.boolean().optional(),
    override_statuses: z.boolean().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    hidden: z.boolean().optional(),
    orderindex: z.number().optional(),
    statuses: z.array(statusDefinitionSchema).optional(),
    // Add other fields like color, orderindex if updatable
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }); 

  export type TUpdateList = z.infer<typeof updatelistSchema>;
