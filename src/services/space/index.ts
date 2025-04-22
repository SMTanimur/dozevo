import { api } from '@/api';
import { Space, SpaceListResponse } from '@/types';
import { createSpaceSchema, updateSpaceSchema } from '@/validations';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;

// Define the base API path function
const getBasePath = (workspaceId: string) => `/v1/workspaces/${workspaceId}/spaces`;

export class SpaceService {
  async getAllSpaces(workspaceId: string): Promise<Space[]> {
    try {
      // API returns SpaceListResponseDto { data: Space[], total: number }
      const response = await api.get<SpaceListResponse>(getBasePath(workspaceId));
      return response.data.data; // Return the array of spaces
    } catch (error) {
      console.error(`Failed to fetch spaces for workspace ${workspaceId}:`, error);
      throw error;
    }
  }

  async getSpaceById(workspaceId: string, spaceId: string): Promise<Space> {
    try {
      const response = await api.get<Space>(
        `${getBasePath(workspaceId)}/${spaceId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch space ${spaceId}:`, error);
      throw error;
    }
  }

  async createSpace(data: CreateSpaceInput): Promise<Space> {
    // Note: workspaceId is required in the data for the DTO, but also used in path
    // Ensure consistency or adjust DTO if path param is sufficient for backend
    if (!data.workspace) {
        throw new Error('Workspace ID is missing in createSpace data.');
    }
    const { workspace: workspaceId, ...payload } = data;
    try {
      createSpaceSchema.parse(data); // Validate the original data including workspaceId
      // API returns SpaceDocument, assuming it maps to Space type
      const response = await api.post<Space>(
        getBasePath(workspaceId),
        payload, // Send payload without workspaceId if not needed in body
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
    data: UpdateSpaceInput,
  ): Promise<Space> {
    try {
      updateSpaceSchema.parse(data);
      // API returns SpaceDocument, assume it maps to Space type
      const response = await api.patch<Space>(
        `${getBasePath(workspaceId)}/${spaceId}`,
        data,
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
}

// Export a singleton instance
export const spaceService = new SpaceService(); 