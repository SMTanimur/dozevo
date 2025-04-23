import { z } from 'zod';
import {
  notificationSchema,
  notificationTypeSchema,
  notificationEntityTypeSchema,
} from '@/validations/notification';

// Type derived from the Zod schema
export type NotificationType = z.infer<typeof notificationTypeSchema>;

// Type derived from the Zod schema
export type NotificationEntityType = z.infer<typeof notificationEntityTypeSchema>;

// Type derived from the Zod schema
export type Notification = z.infer<typeof notificationSchema>;


// Basic representation of a user involved in a notification
export interface NotificationUser {
  _id: string;
  username: string; // Could be 'firstName lastName' or email
  avatar?: string;
}

// Basic representation of the entity related to the notification
export interface NotificationEntity {
  _id: string;
  name?: string; // Optional name, might not always be available/populated
}

// Enum for Notification Types (ensure this matches schema/notification.schema.ts)
export enum INotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMMENT = 'task_comment',
  TASK_STATUS_CHANGE = 'task_status_change',
  MENTION = 'mention',
  DEPENDENCY_ADDED = 'dependency_added',
  DUE_DATE_REMINDER = 'due_date_reminder',
  CHAT_MESSAGE = 'chat_message',
  SYSTEM = 'system',
}

// Enum for Entity Types (ensure this matches schema/notification.schema.ts)
export enum INotificationEntityType {
  Task = 'Task',
  Comment = 'Comment',
  Folder = 'Folder',
  ChatMessage = 'ChatMessage',
  User = 'User',
}

// Core Notification Interface
export interface INotification {
  _id: string;
  recipient: NotificationUser; // User receiving the notification
  sender?: NotificationUser; // User who triggered the notification (optional)
  type: INotificationType;
  message: string;
  entityType?: INotificationEntityType;
  entityId?: string; // Store as string ID
  entity?: NotificationEntity; // Optional populated entity details
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the payload to create a notification
export interface CreateNotificationPayload {
  recipient: string; // Use ObjectId for internal service operations
  type: INotificationType;
  message: string;
  sender?: string
  entityType?: INotificationEntityType;
  entityId?: string
}

// Interface for list responses, including counts
export interface INotificationList {
  data: INotification[];
  total: number;
  unreadCount: number;
}


// Type for the list response structure
export type NotificationListResponse = {
  data: Notification[];
  total: number;
}; 