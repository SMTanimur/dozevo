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
const getSpaceBasePath = (workspaceId: string, spaceId: string) =>
  `/v1/workspaces/${workspaceId}/spaces/${spaceId}`;

const getListBasePath = (
  workspaceId: string,
  spaceId: string,
  listId: string
) => `${getSpaceBasePath(workspaceId, spaceId)}/lists/${listId}`;

// Path for tasks directly under a space
const getSpaceTasksPath = (workspaceId: string, spaceId: string) =>
  `${getSpaceBasePath(workspaceId, spaceId)}/tasks`;

// Path for tasks under a list
const getListTasksPath = (
  workspaceId: string,
  spaceId: string,
  listId: string
) => `${getListBasePath(workspaceId, spaceId, listId)}/tasks`;

// Path for a specific task (requires context: workspace, space, list?)
const getTaskDetailPath = (params: {
  workspaceId: string;
  spaceId: string;
  listId?: string;
  taskId: string;
}) => {
  const { workspaceId, spaceId, listId, taskId } = params;
  const basePath = listId
    ? getListBasePath(workspaceId, spaceId, listId)
    : getSpaceBasePath(workspaceId, spaceId);
  return `${basePath}/tasks/${taskId}`;
};

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

  async getTaskById(params: {
    workspaceId: string;
    spaceId: string;
    listId?: string; // listId might be needed if task is inside a list
    taskId: string;
  }): Promise<Task> {
    const { workspaceId, spaceId, listId, taskId } = params;
    const path = getTaskDetailPath({ workspaceId, spaceId, listId, taskId });
    try {
      const response = await api.get<Task>(path);
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
    data: CreateTaskInput
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

  async updateTask(
    params: {
      workspaceId: string;
      spaceId: string;
      listId?: string;
      taskId: string;
    },
    data: UpdateTaskInput
  ): Promise<Task> {
    const { workspaceId, spaceId, listId, taskId } = params;
    const path = getTaskDetailPath({ workspaceId, spaceId, listId, taskId });
    try {
      updateTaskSchema.parse(data);
      const response = await api.patch<Task>(path, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      throw error;
    }
  }

  async deleteTask(params: {
    workspaceId: string;
    spaceId: string;
    listId?: string;
    taskId: string;
  }): Promise<void> {
    const { workspaceId, spaceId, listId, taskId } = params;
    const path = getTaskDetailPath({ workspaceId, spaceId, listId, taskId });
    try {
      await api.delete(path);
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const taskService = new TaskService();
