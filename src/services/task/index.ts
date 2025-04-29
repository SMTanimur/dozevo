import { api } from '@/api';
import { ITask, TaskListResponse } from '@/types'; // Use ITask for consistency
import {
  createTaskSchema,
  updateTaskSchema,
  GetTasksFilterDto,
} from '@/validations';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
type TaskFilters = z.infer<typeof GetTasksFilterDto>;

// --- Path Helper Functions ---
// Path for tasks directly under a space
const getSpaceTasksPath = (spaceId: string) => `/v1/tasks/spaces/${spaceId}`;

// Path for tasks under a list
const getListTasksPath = (spaceId: string, listId: string) =>
  `/v1/tasks/spaces/${spaceId}/lists/${listId}`;

// Simplified path for single task operations
const getTaskDetailPath = (taskId: string) => `/v1/tasks/${taskId}`;

// --- TaskService Class ---
export class TaskService {
  async getAllTasks(params: {
    spaceId: string;
    listId?: string;
    filters?: TaskFilters;
  }): Promise<TaskListResponse> {
    const { spaceId, listId, filters } = params;
    // Construct path based on presence of listId
    const path = listId
      ? getListTasksPath(spaceId, listId)
      : getSpaceTasksPath(spaceId);

    try {
      const response = await api.get<TaskListResponse>(path, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tasks:`, error);
      throw error;
    }
  }

  // Uses simple /tasks/:taskId path
  async getTaskById(params: { taskId: string }): Promise<ITask> {
    const { taskId } = params;
    const path = getTaskDetailPath(taskId);
    try {
      const response = await api.get<ITask>(path);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch task ${taskId}:`, error);
      throw error;
    }
  }

  // Path depends on listId
  async createTask(
    params: {
      spaceId: string;
      listId?: string;
    },
    data: CreateTaskInput
  ): Promise<ITask> {
    const { spaceId, listId } = params;
    const path = listId
      ? getListTasksPath(spaceId, listId)
      : getSpaceTasksPath(spaceId);

    try {
      createTaskSchema.parse(data); // Validate before sending
      const response = await api.post<ITask>(path, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  // Uses simple /tasks/:taskId path
  async updateTask(
    params: { taskId: string },
    data: UpdateTaskInput
  ): Promise<ITask> {
    const { taskId } = params;
    const path = getTaskDetailPath(taskId);
    try {
      updateTaskSchema.parse(data); // Validate before sending
      const response = await api.patch<ITask>(path, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      throw error;
    }
  }

  // Uses simple /tasks/:taskId path
  async deleteTask(params: { taskId: string }): Promise<void> {
    const { taskId } = params;
    const path = getTaskDetailPath(taskId);
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
