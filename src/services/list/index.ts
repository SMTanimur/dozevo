import { api } from '@/api';
import { IList, IStatusDefinition, ListListResponse } from '@/types';
import {
  createlistSchema,
  TCreateList,
  TUpdateList,
  updatelistSchema,
} from '@/validations';
// Import status types

import { TCreateStatus, TUpdateStatus } from '@/validations/status'; // Assuming these are defined in validations/status

// Define the base API path function for lists
const getListBasePath = (workspaceId: string, spaceId: string) =>
  `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists`;

// Define the base API path function for statuses within a list
const getStatusBasePath = (
  workspaceId: string,
  spaceId: string,
  listId: string
) => `${getListBasePath(workspaceId, spaceId)}/${listId}/statuses`;

export class ListService {
  async getAllLists(workspaceId: string, spaceId: string): Promise<IList[]> {
    try {
      // API returns FolderListResponseDto { data: Folder[], total: number }
      const response = await api.get<ListListResponse>(
        getListBasePath(workspaceId, spaceId)
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
        `${getListBasePath(workspaceId, spaceId)}/${listId}`
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
        getListBasePath(workspaceId, spaceId),
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
        `${getListBasePath(workspaceId, spaceId)}/${listId}`,
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
      await api.delete(`${getListBasePath(workspaceId, spaceId)}/${listId}`);
    } catch (error) {
      console.error(`Failed to delete list ${listId}:`, error);
      throw error;
    }
  }

  // --- Status Methods ---

  async getStatuses(
    workspaceId: string,
    spaceId: string,
    listId: string
  ): Promise<IStatusDefinition[]> {
    try {
      const response = await api.get<IStatusDefinition[]>(
        getStatusBasePath(workspaceId, spaceId, listId)
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch statuses for list ${listId}:`, error);
      throw error;
    }
  }

  async createStatus(
    workspaceId: string,
    spaceId: string,
    listId: string,
    data: TCreateStatus
  ): Promise<IStatusDefinition> {
    try {
      // TODO: Add validation using createStatusSchema if needed
      const response = await api.post<IStatusDefinition>(
        getStatusBasePath(workspaceId, spaceId, listId),
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to create status for list ${listId}:`, error);
      throw error;
    }
  }

  async updateStatus(
    workspaceId: string,
    spaceId: string,
    listId: string,
    statusId: string,
    data: Partial<TUpdateStatus> // Allow partial updates
  ): Promise<IStatusDefinition> {
    try {
      // TODO: Add validation using updateStatusSchema if needed (careful with partials)
      const response = await api.patch<IStatusDefinition>(
        `${getStatusBasePath(workspaceId, spaceId, listId)}/${statusId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to update status ${statusId} in list ${listId}:`,
        error
      );
      throw error;
    }
  }

  async deleteStatus(
    workspaceId: string,
    spaceId: string,
    listId: string,
    statusId: string
  ): Promise<void> {
    try {
      await api.delete(
        `${getStatusBasePath(workspaceId, spaceId, listId)}/${statusId}`
      );
    } catch (error) {
      console.error(
        `Failed to delete status ${statusId} from list ${listId}:`,
        error
      );
      throw error;
    }
  }

  async getOverview(
    workspaceId: string,
    spaceId: string,
    listId: string
  ): Promise<{
    recentTasks: Record<string, unknown>[];
    workloadByStatus: Record<string, unknown>[];
    totalTasks: number;
    totalStatuses: number;
  }> {
    try {
      const response = await api.get(
        `${getListBasePath(workspaceId, spaceId)}/${listId}/overview`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch overview for list ${listId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const listService = new ListService();
