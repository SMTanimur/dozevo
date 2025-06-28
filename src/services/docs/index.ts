import { api } from '@/api';
import { IDoc } from '@/types';

// Define the base API path function
const getBasePath = (workspaceId: string) =>
  `/v1/workspaces/${workspaceId}/docs`;

export class DocsService {
  async getDocsBySpace(workspaceId: string, spaceId: string): Promise<IDoc[]> {
    try {
      const response = await api.get<IDoc[]>(
        `${getBasePath(workspaceId)}?spaceId=${spaceId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch docs for space ${spaceId}:`, error);
      throw error;
    }
  }

  async getDocsByList(workspaceId: string, listId: string): Promise<IDoc[]> {
    try {
      const response = await api.get<IDoc[]>(
        `${getBasePath(workspaceId)}?listId=${listId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch docs for list ${listId}:`, error);
      throw error;
    }
  }

  async getDocById(workspaceId: string, docId: string): Promise<IDoc> {
    try {
      const response = await api.get<IDoc>(
        `${getBasePath(workspaceId)}/${docId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch doc ${docId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const docsService = new DocsService();
