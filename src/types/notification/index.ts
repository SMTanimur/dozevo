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

// Type for the list response structure
export type NotificationListResponse = {
  data: Notification[];
  total: number;
}; 