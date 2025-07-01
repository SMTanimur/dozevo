import { serverApi } from '@/api/server';
import { Workspace, WorkspaceListResponse } from '@/types';

// Define the base API path
const BASE_PATH = '/v1/workspaces';

export class ServerWorkspaceService {
  async getWorkspaceById(id: string, authToken?: string): Promise<Workspace> {
    try {
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.get<Workspace>(
        `${BASE_PATH}/${id}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Server: Failed to fetch workspace ${id}:`, error);
      throw error;
    }
  }

  async getAllWorkspaces(authToken?: string): Promise<Workspace[]> {
    try {
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.get<WorkspaceListResponse>(
        BASE_PATH,
        config
      );
      return response.data.data;
    } catch (error) {
      console.error('Server: Failed to fetch workspaces:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const serverWorkspaceService = new ServerWorkspaceService();
