import { z } from 'zod';
import { userSchema } from './user';

// Enum matching API definition
export const statusTypeSchema = z.enum([
  'open',
  'custom',
  'closed',
  'done',
]);

// Schema for StatusDefinition subdocument
export const statusDefinitionSchema = z.object({
  clickUpId: z.string().optional(),
  status: z.string({ required_error: 'Status name is required' }),
  orderindex: z.number({ required_error: 'Status order is required' }),
  color: z.string({ required_error: 'Status color is required' }),
  type: statusTypeSchema,
});

// Schema for SpaceFeaturesConfig subdocument
export const spaceFeaturesConfigSchema = z.object({
  due_dates: z.object({
    enabled: z.boolean(),
    start_date: z.boolean(),
    remap_due_dates: z.boolean(),
    remap_closed_due_date: z.boolean(),
  }).optional(),
  time_tracking: z.object({
    enabled: z.boolean(),
    harvest: z.boolean(),
    rollup: z.boolean(),
    default: z.boolean().optional(),
  }).optional(),
  points: z.object({ enabled: z.boolean() }).optional(),
  // Add other features based on API schema
}).passthrough(); // Allow unknown keys if API adds features

// Main schema for the Space object returned by the API
export const spaceSchema = z.object({
  _id: z.string({ required_error: 'Space ID is required' }),
  name: z.string({ required_error: 'Space name is required' }).min(1, 'Space name cannot be empty'),
  workspace: z.string({ required_error: 'Workspace ID is required' }), // Assuming workspace ID is returned
  clickUpSpaceId: z.string().optional(),
  private: z.boolean().default(false),
  color: z.string().nullable().optional(),
  avatar: z.string().url('Invalid avatar URL').nullable().optional(),
  archived: z.boolean().default(false),
  members: z.array(z.string()).optional(), // Assuming array of User IDs
  statuses: z.array(statusDefinitionSchema).default([]),
  multiple_assignees: z.boolean().default(false),
  features: spaceFeaturesConfigSchema.default({}),
  // folders: z.array(z.string()).optional(), // Assuming array of Folder IDs
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a space (matching CreateSpaceDto)
export const createSpaceSchema = z.object({
  name: z
    .string({ required_error: 'Space name is required' })
    .min(1, 'Space name cannot be empty')
    .trim(),
  workspace: z.string({ required_error: 'Workspace ID is required' }),
  // Add initial members, statuses, features, etc., if API supports
  color: z.string().nullable().optional(),
  avatar: z.string().url('Invalid avatar URL').nullable().optional(),
  private: z.boolean().optional().default(false),
});

// Schema for updating a space (matching UpdateSpaceDto)
export const updateSpaceSchema = z
  .object({
    name: z.string().min(1, 'Space name cannot be empty').trim().optional(),
    color: z.string().nullable().optional(),
    avatar: z.string().url('Invalid avatar URL').nullable().optional(),
    private: z.boolean().optional(),
    archived: z.boolean().optional(),
    multiple_assignees: z.boolean().optional(),
    // statuses: z.array(statusDefinitionSchema).optional(), // Usually handled separately
    // features: spaceFeaturesConfigSchema.optional(), // Usually handled separately
    // members: z.array(z.string()).optional(), // Usually handled separately
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }); 