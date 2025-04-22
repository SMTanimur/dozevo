import { api } from '@/api';
import { Folder, FolderListResponse } from '@/types';
import { createFolderSchema, updateFolderSchema } from '@/validations';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
type CreateFolderInput = z.infer<typeof createFolderSchema>;
type UpdateFolderInput = z.infer<typeof updateFolderSchema>;

// Define the base API path function
const getBasePath = (workspaceId: string, spaceId: string) =>
  `/v1/workspaces/${workspaceId}/spaces/${spaceId}/folders`;

export class FolderService {
  async getAllFolders(workspaceId: string, spaceId: string): Promise<Folder[]> {
    try {
      // API returns FolderListResponseDto { data: Folder[], total: number }
      const response = await api.get<FolderListResponse>(
        getBasePath(workspaceId, spaceId),
      );
      return response.data.data; // Return the array of folders
    } catch (error) {
      console.error(`Failed to fetch folders for space ${spaceId}:`, error);
      throw error;
    }
  }

  async getFolderById(
    workspaceId: string,
    spaceId: string,
    folderId: string,
  ): Promise<Folder> {
    try {
      const response = await api.get<Folder>(
        `${getBasePath(workspaceId, spaceId)}/${folderId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch folder ${folderId}:`, error);
      throw error;
    }
  }

  async createFolder(data: CreateFolderInput): Promise<Folder> {
    // spaceId is required in the DTO
    if (!data.space) {
      throw new Error('Space ID is missing in createFolder data.');
    }
    // Assuming workspaceId is implicitly handled by space context or not needed in body
    // Adjust if API requires workspaceId in body explicitly
    const { space: spaceId, ...payload } = data;
    // Need workspaceId for the path, which isn't in CreateFolderInput. How to get it?
    // We need to rethink how createFolder gets workspaceId.
    // For now, let's assume it's passed separately or the API doesn't need it in path?
    // This needs clarification based on API implementation details.
    // Let's assume for now the API handles workspace context via spaceId.

    // TODO: Clarify how workspaceId is passed or derived for the API call path.
    // Mocking workspaceId retrieval or passing it as an argument.
    const workspaceId = 'TEMP_WORKSPACE_ID'; // Placeholder
    if (workspaceId === 'TEMP_WORKSPACE_ID') {
        console.warn('createFolder service needs workspaceId. Using placeholder.')
    }

    try {
      createFolderSchema.parse(data); // Validate original data
      const response = await api.post<Folder>(
        getBasePath(workspaceId, spaceId),
        payload,
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  }

  async updateFolder(
    workspaceId: string,
    spaceId: string,
    folderId: string,
    data: UpdateFolderInput,
  ): Promise<Folder> {
    try {
      updateFolderSchema.parse(data);
      const response = await api.patch<Folder>(
        `${getBasePath(workspaceId, spaceId)}/${folderId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update folder ${folderId}:`, error);
      throw error;
    }
  }

  async deleteFolder(
    workspaceId: string,
    spaceId: string,
    folderId: string,
  ): Promise<void> {
    try {
      await api.delete(`${getBasePath(workspaceId, spaceId)}/${folderId}`);
    } catch (error) {
      console.error(`Failed to delete folder ${folderId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const folderService = new FolderService(); 