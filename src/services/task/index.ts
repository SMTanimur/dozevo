import { api } from '@/api';
import { Task, TaskListResponse } from '@/types'; // Assuming TaskListResponse exists or needs creation
import {
  createTaskSchema,
  updateTaskSchema,
  GetTasksFilterDto, // Assuming this DTO/type is defined in validations/index
} from '@/validations';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
// Type for filter DTO
type TaskFilters = z.infer<typeof GetTasksFilterDto>; // Make sure GetTasksFilterDto is a Zod schema

// Define the base API paths (note the context)
const getSpaceTasksPath = (workspaceId: string, spaceId: string) =>
  `/v1/workspaces/${workspaceId}/spaces/${spaceId}/tasks`;
const getListTasksPath = (
  workspaceId: string,
  spaceId: string,
  listId: string,
) => `/v1/workspaces/${workspaceId}/spaces/${spaceId}/lists/${listId}/tasks`;
const getTaskDetailPath = (taskId: string) => `/v1/tasks/${taskId}`; // Simpler path assuming service handles context

export class TaskService {
  async getAllTasks(params: {
    workspaceId: string;
    spaceId: string;
    listId?: string;
    filters?: TaskFilters;
  }): Promise<TaskListResponse> {
    const { workspaceId, spaceId, listId, filters } = params;
    const path = listId
      ? getListTasksPath(workspaceId, spaceId, listId)
      : getSpaceTasksPath(workspaceId, spaceId);

    try {
      const response = await api.get<TaskListResponse>(path, {
        params: filters, // Pass filters as query parameters
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tasks:`, error);
      throw error;
    }
  }

  async getTaskById(taskId: string): Promise<Task> {
    // The API controller has context in the path, but the service likely just needs the ID.
    // We'll use a simplified path here, assuming the backend service handles verification.
    // If specific context paths are needed, this method might need adjustment.
    try {
      // TODO: Verify if `/v1/tasks/:taskId` exists or if context path is needed.
      // Assuming a direct task endpoint exists for simplicity for now.
      const response = await api.get<Task>(getTaskDetailPath(taskId));
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch task ${taskId}:`, error);
      throw error;
    }
  }

  async createTask(
    params: {
      workspaceId: string;
      spaceId: string;
      listId?: string;
    },
    data: CreateTaskInput,
  ): Promise<Task> {
    const { workspaceId, spaceId, listId } = params;
    const path = listId
      ? getListTasksPath(workspaceId, spaceId, listId)
      : getSpaceTasksPath(workspaceId, spaceId);

    try {
      createTaskSchema.parse(data);
      const response = await api.post<Task>(path, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, data: UpdateTaskInput): Promise<Task> {
    // Like getTaskById, assuming a simplified path. Adjust if needed.
    try {
      updateTaskSchema.parse(data);
      // TODO: Verify if `/v1/tasks/:taskId` exists or if context path is needed.
      const response = await api.patch<Task>(getTaskDetailPath(taskId), data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    // Like getTaskById, assuming a simplified path. Adjust if needed.
    try {
      // TODO: Verify if `/v1/tasks/:taskId` exists or if context path is needed.
      await api.delete(getTaskDetailPath(taskId));
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const taskService = new TaskService(); 