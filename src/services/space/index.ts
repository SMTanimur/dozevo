import { api } from '@/api';
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

export class SpaceService {
  async getAllSpaces(workspaceId: string): Promise<ISpace[]> {
    try {
      // API returns SpaceListResponseDto { data: Space[], total: number }
      const response = await api.get<ISpaceListResponse>(
        getBasePath(workspaceId)
      );
      return response.data.data; // Return the array of spaces
    } catch (error) {
      console.error(
        `Failed to fetch spaces for workspace ${workspaceId}:`,
        error
      );
      throw error;
    }
  }

  async getSpaceById(workspaceId: string, spaceId: string): Promise<ISpace> {
    try {
      const response = await api.get<ISpace>(
        `${getBasePath(workspaceId)}/${spaceId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch space ${spaceId}:`, error);
      throw error;
    }
  }

  async createSpace(data: TCreateSpace): Promise<ISpace> {
    // Note: workspaceId is required in the data for the DTO, but also used in path
    // Ensure consistency or adjust DTO if path param is sufficient for backend
    if (!data.workspace) {
      throw new Error('Workspace ID is missing in createSpace data.');
    }
    const { workspace: workspaceId, ...payload } = data;
    try {
      createSpaceSchema.parse(data); // Validate the original data including workspaceId
      // API returns SpaceDocument, assuming it maps to Space type
      const response = await api.post<ISpace>(
        getBasePath(workspaceId),
        payload // Send payload without workspaceId if not needed in body
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create space:', error);
      throw error;
    }
  }

  async updateSpace(
    workspaceId: string,
    spaceId: string,
    data: TUpdateSpace
  ): Promise<ISpace> {
    try {
      updateSpaceSchema.parse(data);
      // API returns SpaceDocument, assume it maps to Space type
      const response = await api.patch<ISpace>(
        `${getBasePath(workspaceId)}/${spaceId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update space ${spaceId}:`, error);
      throw error;
    }
  }

  async deleteSpace(workspaceId: string, spaceId: string): Promise<void> {
    try {
      await api.delete(`${getBasePath(workspaceId)}/${spaceId}`);
    } catch (error) {
      console.error(`Failed to delete space ${spaceId}:`, error);
      throw error;
    }
  }

  async getOverview(
    workspaceId: string,
    spaceId: string
  ): Promise<{
    recentTasks: Record<string, unknown>[];
    workloadByStatus: Record<string, unknown>[];
    recentDocs: Record<string, unknown>[];
    totalTasks: number;
    totalDocs: number;
  }> {
    try {
      const response = await api.get(
        `${getBasePath(workspaceId)}/${spaceId}/overview`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch overview for space ${spaceId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const spaceService = new SpaceService();

// Export server service
export * from './server';
