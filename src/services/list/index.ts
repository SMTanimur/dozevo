import { api } from '@/api';
import { IList, ListListResponse } from '@/types';
import {
  createlistSchema,
  TCreateList,
  TUpdateList,
  updatelistSchema,
} from '@/validations';

// Define the base API path function
const getBasePath = (workspaceId: string, spaceId: string) =>
  `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists`;

export class ListService {
  async getAllLists(workspaceId: string, spaceId: string): Promise<IList[]> {
    try {
      // API returns FolderListResponseDto { data: Folder[], total: number }
      const response = await api.get<ListListResponse>(
        getBasePath(workspaceId, spaceId)
      );
      return response.data.data; // Return the array of folders
    } catch (error) {
      console.error(`Failed to fetch lists for space ${spaceId}:`, error);
      throw error;
    }
  }

  async getListById(
    workspaceId: string,
    spaceId: string,
    listId: string
  ): Promise<IList> {
    try {
      const response = await api.get<IList>(
        `${getBasePath(workspaceId, spaceId)}/${listId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch list ${listId}:`, error);
      throw error;
    }
  }

  async createList(workspaceId: string, data: TCreateList): Promise<IList> {
    // spaceId is required in the DTO
    if (!data.space) {
      throw new Error('Space ID is missing in createList data.');
    }
    // Assuming workspaceId is implicitly handled by space context or not needed in body
    // Adjust if API requires workspaceId in body explicitly
    const { space: spaceId, ...payload } = data;

    // TODO: Clarify how workspaceId is passed or derived for the API call path.
    // Mocking workspaceId retrieval or passing it as an argument.

    try {
      createlistSchema.parse(data); // Validate original data
      const response = await api.post<IList>(
        getBasePath(workspaceId, spaceId),
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create list:', error);
      throw error;
    }
  }

  async updateList(
    workspaceId: string,
    spaceId: string,
    listId: string,
    data: TUpdateList
  ): Promise<IList> {
    try {
      updatelistSchema.parse(data);
      const response = await api.patch<IList>(
        `${getBasePath(workspaceId, spaceId)}/${listId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update list ${listId}:`, error);
      throw error;
    }
  }

  async deleteList(
    workspaceId: string,
    spaceId: string,
    listId: string
  ): Promise<void> {
    try {
      await api.delete(`${getBasePath(workspaceId, spaceId)}/${listId}`);
    } catch (error) {
      console.error(`Failed to delete list ${listId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const listService = new ListService();
