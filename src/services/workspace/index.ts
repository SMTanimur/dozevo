import { api } from '@/api';
import { Workspace, WorkspaceListResponse } from '@/types';
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/validations';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

// Define the base API path
const BASE_PATH = '/v1/workspaces';

export class WorkspaceService {
  async getAllWorkspaces(): Promise<Workspace[]> {
    try {
      // The API returns WorkspaceListResponseDto which has { data: Workspace[], total: number }
      // We extract the data array.
      const response = await api.get<WorkspaceListResponse>(BASE_PATH);
      return response.data.data; // Return the array of workspaces
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      // Re-throw or return empty array based on desired error handling
      throw error;
    }
  }

  async getWorkspaceById(id: string): Promise<Workspace> {
    try {
      const response = await api.get<Workspace>(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch workspace ${id}:`, error);
      throw error;
    }
  }

  async createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
    try {
      // Validate input data (optional here, often done in calling component/hook)
      createWorkspaceSchema.parse(data);
      const response = await api.post<Workspace>(BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create workspace:', error);
      // Handle Zod validation errors specifically if needed
      throw error;
    }
  }

  async updateWorkspace(
    id: string,
    data: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    try {
      // Validate input data (optional here)
      updateWorkspaceSchema.parse(data);
      // API returns WorkspaceDocument, but we'll assume it maps to Workspace type
      const response = await api.patch<Workspace>(`${BASE_PATH}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update workspace ${id}:`, error);
      throw error;
    }
  }

  async deleteWorkspace(id: string): Promise<void> {
    try {
      await api.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      console.error(`Failed to delete workspace ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const workspaceService = new WorkspaceService(); 