import { api } from '@/api';
import { Notification, NotificationListResponse } from '@/types';

// Define type for query parameters
interface GetNotificationsParams {
  limit?: number;
  offset?: number;
  unread?: boolean;
}

// Define the base API path
const BASE_PATH = '/v1/notifications';

export class NotificationService {
  async getNotifications(
    params?: GetNotificationsParams,
  ): Promise<NotificationListResponse> {
    try {
      const response = await api.get<NotificationListResponse>(BASE_PATH, {
        params: params, // Pass filters as query parameters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await api.patch<Notification>(
        `${BASE_PATH}/${notificationId}/read`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<{ markedCount: number }> {
    try {
      const response = await api.post<{ markedCount: number }>(
        `${BASE_PATH}/read-all`,
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationService(); 