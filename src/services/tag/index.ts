import { api } from '@/api';
import { Tag, } from '@/types'; // Assuming TagListResponse exists or needs creation
import { createTagSchema, TCreateTag, TUpdateTag, updateTagSchema } from '@/validations/tag';




// Define the base API path function
const getBasePath = (workspaceId: string) => `/v1/workspaces/${workspaceId}/tags`;

export class TagService {
  async getAllTags(workspaceId: string): Promise<Tag[]> {
    try {
      // Assuming API returns { data: Tag[], total: number } or just Tag[]
      // Adjust response type if API returns a structured list response
      const response = await api.get<Tag[]>(getBasePath(workspaceId));
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tags for workspace ${workspaceId}:`, error);
      throw error;
    }
  }

  async getTagById(workspaceId: string, tagId: string): Promise<Tag> {
    try {
      const response = await api.get<Tag>(`${getBasePath(workspaceId)}/${tagId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tag ${tagId}:`, error);
      throw error;
    }
  }

  async createTag(data: TCreateTag): Promise<Tag> {
    if (!data.workspace) {
        throw new Error('Workspace ID is missing in createTag data.');
    }
    const { workspace: workspaceId, ...payload } = data;
    try {
      createTagSchema.parse(data);
      const response = await api.post<Tag>(getBasePath(workspaceId), payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create tag:', error);
      throw error;
    }
  }

  async updateTag(
    workspaceId: string,
    tagId: string,
    data: TUpdateTag,
  ): Promise<Tag> {
    try {
      updateTagSchema.parse(data);
      const response = await api.patch<Tag>(`${getBasePath(workspaceId)}/${tagId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update tag ${tagId}:`, error);
      throw error;
    }
  }

  async deleteTag(workspaceId: string, tagId: string): Promise<void> {
    try {
      await api.delete(`${getBasePath(workspaceId)}/${tagId}`);
    } catch (error) {
      console.error(`Failed to delete tag ${tagId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const tagService = new TagService(); 