import { z } from 'zod';

import { statusDefinitionSchema } from './space'; // Import status schema

// --- Sub-Schemas based on API structure ---

// Simple Tag representation (assuming this structure)
export const tagSchema = z.object({
  _id: z.string(),
  name: z.string(),
  color: z.string().optional(),
  // workspace: z.string(), // workspace ID if included
});

// Priority Value
export const priorityValueSchema = z.object({
  priority: z.string(),
  color: z.string(),
});

// Checklist Item
export const checklistItemSchema = z.object({
  _id: z.string().optional(), // Might be internal ID
  clickUpItemId: z.string().optional(),
  name: z.string(),
  orderindex: z.number().default(0),
  assignee: z.string().nullable().optional(), // Assuming Assignee ID
  resolved: z.boolean().default(false),
  parent: z.string().nullable().optional(),
  creator: z.string().optional(), // Assuming Creator ID
  // children: z.lazy(() => z.array(checklistItemSchema)).optional(), // Recursive definition if needed
});

// Checklist
export const checklistSchema = z.object({
  _id: z.string().optional(), // Might be internal ID
  clickUpChecklistId: z.string().optional(),
  name: z.string(),
  orderindex: z.number().default(0),
  creator: z.string().optional(),
  resolved_count: z.number().default(0),
  unresolved_count: z.number().default(0),
  items: z.array(checklistItemSchema).default([]),
});

// Custom Field Value Data (simplified - adjust based on actual API)
export const customFieldValueDataSchema = z.object({
  fieldDefinition: z.string(), // Assuming Field Definition ID
  value: z.any().optional(), // Value can be varied
});

// Task Relation Type Enum (match API if different)
export const taskRelationTypeSchema = z.enum([
  'dependency',
  'link',
  'waiting_on',
  'blocking',
]);

// Task Relation
export const taskRelationSchema = z.object({
  relatedTask: z.string(), // Assuming related Task ID
  type: taskRelationTypeSchema,
  addedBy: z.string(), // Assuming User ID
  dateAdded: z.string().datetime(),
});

// --- Main Task Schema ---

export const taskSchema = z.object({
  _id: z.string({ required_error: 'Task ID is required' }),
  workspace: z.string({ required_error: 'Workspace ID is required' }),
  space: z.string({ required_error: 'Space ID is required' }),
  folder: z.string().nullable().optional(), // Folder ID
  clickUpTaskId: z.string().optional(),
  custom_id: z.string().nullable().optional(),
  name: z
    .string({ required_error: 'Task name is required' })
    .min(1, 'Task name cannot be empty'),
  text_content: z.string().optional(),
  description: z.string().optional(),
  status: statusDefinitionSchema, // Embed status schema
  priority: priorityValueSchema.nullable().optional(),
  assignees: z.array(z.string()).default([]), // Array of populated users
  watchers: z.array(z.string()).default([]), // Array of populated users
  tags: z.array(tagSchema).default([]), // Array of populated tags (using simple schema above)
  checklists: z.array(checklistSchema).default([]),
  due_date: z.string().datetime().nullable().optional(),
  due_date_time: z.boolean().optional(),
  start_date: z.string().datetime().nullable().optional(),
  start_date_time: z.boolean().optional(),
  points: z.number().nullable().optional(),
  time_estimate: z.number().nullable().optional(),
  time_spent: z.number().default(0),
  parentTask: z.string().nullable().optional(), // Parent Task ID
  custom_fields: z.array(customFieldValueDataSchema).default([]),
  relations: z.array(taskRelationSchema).default([]),
  creator: z.string().optional(), // Embed populated creator user
  orderindex: z.string().optional(), // ClickUp uses string here
  archived: z.boolean().default(false),
  date_created_clickup: z.string().datetime().optional(),
  date_updated_clickup: z.string().datetime().optional(),
  date_closed_clickup: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a task (based on CreateTaskDto)
export const createTaskSchema = z.object({
  name: z
    .string({ required_error: 'Task name is required' })
    .min(1, 'Task name cannot be empty')
    .trim(),
  // workspace and space are typically path parameters, not in body
  folderId: z.string().optional(), // Folder ID is optional
  parentTask: z.string().nullable().optional(), // Optional parent task ID
  status: statusDefinitionSchema
    .pick({
      // Require necessary fields for status subdoc
      status: true,
      orderindex: true,
      color: true,
      type: true,
    })
    .extend({ clickUpId: z.string().optional() })
    .optional(),
  description: z.string().optional(),
  assignees: z.array(z.string()).optional(), // Array of User IDs
  watchers: z.array(z.string()).optional(), // Array of User IDs
  tags: z.array(z.string()).optional(), // Array of Tag IDs
  priority: priorityValueSchema.nullable().optional(),
  due_date: z
    .string()
    .datetime({ message: 'Invalid due date format' })
    .nullable()
    .optional(),
  start_date: z
    .string()
    .datetime({ message: 'Invalid start date format' })
    .nullable()
    .optional(),
  time_estimate: z.number().int().positive().nullable().optional(),
  // points, custom_fields, checklists might be added if supported
});

// Schema for updating a task (based on UpdateTaskDto)
export const updateTaskSchema = z
  .object({
    name: z.string().min(1, 'Task name cannot be empty').trim().optional(),
    listId: z.string().nullable().optional(), // Allow moving or removing from folder
    parentTask: z.string().nullable().optional(),
    status: statusDefinitionSchema
      .pick({
        // Allow updating status fields
        status: true,
        orderindex: true,
        color: true,
        type: true,
      })
      .extend({ clickUpId: z.string().optional() })
      .optional(),
    description: z.string().nullable().optional(),
    assignees: z.array(z.string()).optional(),
    watchers: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    priority: priorityValueSchema.nullable().optional(),
    due_date: z
      .string()
      .datetime({ message: 'Invalid due date format' })
      .nullable()
      .optional(),
    start_date: z
      .string()
      .datetime({ message: 'Invalid start date format' })
      .nullable()
      .optional(),
    time_estimate: z.number().int().positive().nullable().optional(),
    time_spent: z.number().int().nonnegative().optional(),
    archived: z.boolean().optional(),
    // points, custom_fields, checklists updates if supported
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type TCreateTask = z.infer<typeof createTaskSchema>;
export type TUpdateTask = z.infer<typeof updateTaskSchema>;

// Schema for task filtering query parameters (based on GetTasksFilterDto)
export const GetTasksFilterDto = z
  .object({
    status: z.string().optional(),
    assignee: z.string().optional(),
    archived: z.boolean().optional(),
    search: z.string().optional(),
    parentTaskId: z.string().nullable().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    // Add other potential filters like tags, priority, due date ranges if implemented
  })
  .optional(); // Make the whole filter object optional

export type TGetTasksFilter = z.infer<typeof GetTasksFilterDto>;
