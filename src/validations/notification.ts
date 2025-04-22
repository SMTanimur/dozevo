import { z } from 'zod';
import { userSchema } from './user';

// Enums based on API schema (adjust if needed)
export const notificationTypeSchema = z.enum([
  'TASK_ASSIGNED',
  'TASK_COMMENT',
  'TASK_STATUS_CHANGE',
  // Add other notification types
]);

export const notificationEntityTypeSchema = z.enum([
  'Task',
  'Comment',
  // Add other entity types
]);

// Schema for the Notification object returned by the API
export const notificationSchema = z.object({
  _id: z.string({ required_error: 'Notification ID is required' }),
  recipient: z.string({ required_error: 'Recipient ID is required' }), // Assuming recipient is just an ID
  sender: userSchema, // Assuming sender is populated
  type: notificationTypeSchema,
  message: z.string({ required_error: 'Message is required' }),
  entityType: notificationEntityTypeSchema,
  entityId: z.string({ required_error: 'Entity ID is required' }),
  read: z.boolean().default(false),
  createdAt: z.string().datetime(),
  // updatedAt might not be present if notifications aren't updated
}); 