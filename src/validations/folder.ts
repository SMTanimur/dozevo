import { z } from 'zod';

// Basic schema for Folder object returned by the API
export const folderSchema = z.object({
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
export const createFolderSchema = z.object({
  name: z
    .string({ required_error: 'Folder name is required' })
    .min(1, 'Folder name cannot be empty')
    .trim(),
  space: z.string({ required_error: 'Space ID is required' }),
  // Add workspace if needed by API endpoint
});

// Schema for updating a folder (matching UpdateFolderDto)
export const updateFolderSchema = z
  .object({
    name: z.string().min(1, 'Folder name cannot be empty').trim().optional(),
    archived: z.boolean().optional(),
    // Add other fields like color, orderindex if updatable
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }); 