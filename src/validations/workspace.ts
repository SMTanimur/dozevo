import { z } from 'zod';
import { userSchema } from './user'; // Assuming user schema is in the same directory or adjust path
import { WorkspaceType } from '@/types';

// Schema for custom role within a workspace member (adjust if needed)
export const customRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Schema for a single workspace member
export const workspaceMemberSchema = z.object({
  user: userSchema, // Embed the user schema
  invited_by: z.string().optional(), // Assuming ID string
  role: z.number().optional(), // Assuming role is a number ID
  custom_role: customRoleSchema.nullable().optional(),
  date_joined: z.string().datetime().optional(),
  date_invited: z.string().datetime().optional(),
  // Note: API might return populated invited_by user, adjust if necessary
});

// Main schema for the Workspace object returned by the API
export const workspaceSchema = z.object({
  _id: z.string({ required_error: 'Workspace ID is required' }),
  name: z.string({ required_error: 'Workspace name is required' }).min(1, 'Workspace name cannot be empty'),
  clickUpTeamId: z.string().optional(),
  color: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').nullable().optional(),
  workspaceType: z.nativeEnum(WorkspaceType),
  members: z.array(workspaceMemberSchema).default([]),
  // spaces: z.array(z.string()).optional(), // Assuming space IDs are strings if included
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a workspace (matching CreateWorkspaceDto)
export const createWorkspaceSchema = z.object({
  name: z
    .string({ required_error: 'Workspace name is required' })
    .min(1, 'Workspace name cannot be empty')
    .trim(),
  workspaceType: z.nativeEnum(WorkspaceType),
  // Add color, avatar, or initial members if the API supports it during creation
});

export type TCreateWorkspace = z.infer<typeof createWorkspaceSchema>;


// Schema for updating a workspace (matching UpdateWorkspaceDto)
export const updateWorkspaceSchema = z
  .object({
    name: z.string().min(1, 'Workspace name cannot be empty').trim().optional(),
    color: z.string().nullable().optional(), // Allow setting color
    avatar: z.string().url('Invalid avatar URL').nullable().optional(), // Allow updating/clearing avatar
    workspaceType: z.nativeEnum(WorkspaceType).optional(),
    // We don't usually allow updating members directly here, handle via separate endpoints
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }); 

export type TUpdateWorkspace = z.infer<typeof updateWorkspaceSchema>;
