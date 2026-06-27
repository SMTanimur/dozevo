import { api } from '@/api';
import { IFlowchart } from '@/types';

// Define the base API path function
const getBasePath = (workspaceId: string) =>
  `/v1/workspaces/${workspaceId}/flowcharts`;

export class FlowchartsService {
  async getFlowchartsBySpace(workspaceId: string, spaceId: string): Promise<IFlowchart[]> {
    try {
      const response = await api.get<IFlowchart[]>(
        `${getBasePath(workspaceId)}?spaceId=${spaceId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch flowcharts for space ${spaceId}:`, error);
      throw error;
    }
  }

  async getFlowchartsByList(workspaceId: string, listId: string): Promise<IFlowchart[]> {
    try {
      const response = await api.get<IFlowchart[]>(
        `${getBasePath(workspaceId)}?listId=${listId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch flowcharts for list ${listId}:`, error);
      throw error;
    }
  }

  async getFlowchartById(workspaceId: string, id: string): Promise<IFlowchart> {
    try {
      const response = await api.get<IFlowchart>(
        `${getBasePath(workspaceId)}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch flowchart ${id}:`, error);
      throw error;
    }
  }

  async createFlowchart(workspaceId: string, data: Partial<IFlowchart>): Promise<IFlowchart> {
    try {
      const response = await api.post<IFlowchart>(
        getBasePath(workspaceId),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create flowchart:', error);
      throw error;
    }
  }

  async updateFlowchart(workspaceId: string, id: string, data: Partial<IFlowchart>): Promise<IFlowchart> {
    try {
      const response = await api.patch<IFlowchart>(
        `${getBasePath(workspaceId)}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update flowchart ${id}:`, error);
      throw error;
    }
  }

  async deleteFlowchart(workspaceId: string, id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(
        `${getBasePath(workspaceId)}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete flowchart ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const flowchartsService = new FlowchartsService();
