import { IStatusDefinition } from "../space";
import { z } from 'zod';
import {
  taskSchema,
  tagSchema,
  priorityValueSchema,
  checklistItemSchema,
  checklistSchema,
  customFieldValueDataSchema,
  taskRelationTypeSchema,
  taskRelationSchema,
} from '@/validations/task';

//  for Task Priority (matches schema)
export interface ITaskPriority {
  id: string;
  name: string;
  color: string;
  level: number;
}

//  for Task Tag (matches schema)
export interface ITaskTag {
  name: string;
  color?: string;
}

//  for Custom Field Value
export interface ICustomFieldValue {
  field: string; // Custom Field Definition ID as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // Value type depends on field definition
}

//  for representing assignees/watchers/creator (simplified)
// Now includes populated fields
export interface ITaskUser {
  _id: string; // User ID
  firstName?: string;
  lastName?: string;
  email?: string; // Added email
  avatar?: string;
}

// Represents the data structure for a single task response
export interface ITask {
  _id: string; // Or map to 'id'
  workspace: string; // Workspace ID as string
  space: string; // Space ID as string
  list: string | null; // Optional Folder ID as string
  name: string;
  description?: string;
  status: IStatusDefinition; // Use the Status 
  priority: ITaskPriority | null; // Use the Priority 
  assignees: ITaskUser[]; // Use updated TaskUser
  watchers: ITaskUser[]; // Use updated TaskUser
  tags: ITaskTag[]; // Use the Tag 
  dueDate: string | null; // ISO Date string or null
  startDate: string | null; // ISO Date string or null
  timeEstimate: number | null;
  timeSpent: number | null;
  parentTask: ITask | null; // Parent Task ID as string or null
  customFields: ICustomFieldValue[]; // Use the Custom Field 
  creator: ITaskUser; // Use updated TaskUser
  orderIndex?: number;
  completedAt: string | null; // ISO Date string or null
  archived: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Represents the data structure for a list of tasks response
export interface ITaskListResponse {
  data: ITask[]; // Array of tasks (could be simplified further)
  total: number; // Total count for pagination
  // Add other pagination fields if needed
}

// Type derived from the Zod schema
export type Tag = z.infer<typeof tagSchema>;

// Type derived from the Zod schema
export type PriorityValue = z.infer<typeof priorityValueSchema>;

// Type derived from the Zod schema
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

// Type derived from the Zod schema
export type Checklist = z.infer<typeof checklistSchema>;

// Type derived from the Zod schema
export type CustomFieldValueData = z.infer<typeof customFieldValueDataSchema>;

// Type derived from the Zod schema
export type TaskRelationType = z.infer<typeof taskRelationTypeSchema>;

// Type derived from the Zod schema
export type TaskRelation = z.infer<typeof taskRelationSchema>;

// Type derived from the Zod schema
export type Task = z.infer<typeof taskSchema>;

// Type for the list response structure
export type TaskListResponse = {
  data: Task[];
  total: number;
};
