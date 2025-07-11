import { serverApi } from '@/api/server';
import { ISpace, ISpaceListResponse } from '@/types';
import {
  createSpaceSchema,
  TCreateSpace,
  TUpdateSpace,
  updateSpaceSchema,
} from '@/validations';

// Define the base API path function
const getBasePath = (workspaceId: string) =>
  `/v1/workspaces/${workspaceId}/spaces`;

export class ServerSpaceService {
  async getAllSpaces(
    workspaceId: string,
    authToken?: string
  ): Promise<ISpace[]> {
    try {
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.get<ISpaceListResponse>(
        getBasePath(workspaceId),
        config
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Server: Failed to fetch spaces for workspace ${workspaceId}:`,
        error
      );
      throw error;
    }
  }

  async getSpaceById(
    workspaceId: string,
    spaceId: string,
    authToken?: string
  ): Promise<ISpace> {
    try {
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.get<ISpace>(
        `${getBasePath(workspaceId)}/${spaceId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Server: Failed to fetch space ${spaceId}:`, error);
      throw error;
    }
  }

  async createSpace(data: TCreateSpace, authToken?: string): Promise<ISpace> {
    if (!data.workspace) {
      throw new Error('Workspace ID is missing in createSpace data.');
    }

    const { workspace: workspaceId, ...payload } = data;

    try {
      createSpaceSchema.parse(data);

      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.post<ISpace>(
        getBasePath(workspaceId),
        payload,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Server: Failed to create space:', error);
      throw error;
    }
  }

  async updateSpace(
    workspaceId: string,
    spaceId: string,
    data: TUpdateSpace,
    authToken?: string
  ): Promise<ISpace> {
    try {
      updateSpaceSchema.parse(data);

      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.patch<ISpace>(
        `${getBasePath(workspaceId)}/${spaceId}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Server: Failed to update space ${spaceId}:`, error);
      throw error;
    }
  }

  async deleteSpace(
    workspaceId: string,
    spaceId: string,
    authToken?: string
  ): Promise<void> {
    try {
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      await serverApi.delete(`${getBasePath(workspaceId)}/${spaceId}`, config);
    } catch (error) {
      console.error(`Server: Failed to delete space ${spaceId}:`, error);
      throw error;
    }
  }

  async getOverview(
    workspaceId: string,
    spaceId: string,
    authToken?: string
  ): Promise<{
    recentTasks: Record<string, unknown>[];
    workloadByStatus: Record<string, unknown>[];
    recentDocs: Record<string, unknown>[];
    totalTasks: number;
    totalDocs: number;
  }> {
    try {
      const config = authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : {};

      const response = await serverApi.get(
        `${getBasePath(workspaceId)}/${spaceId}/overview`,
        config
      );
      return response.data;
    } catch (error) {
      console.error(
        `Server: Failed to fetch overview for space ${spaceId}:`,
        error
      );
      throw error;
    }
  }
}

// Export a singleton instance
export const serverSpaceService = new ServerSpaceService();
