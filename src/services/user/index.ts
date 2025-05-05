import { api } from '@/api';
import { IUser, UpdateActiveWorkspaceDto } from '@/types';
import { updateUserSchema } from '@/validations';
import Cookies from 'js-cookie';
import { z } from 'zod';

// Define types for the input data based on Zod schemas
// Assuming UpdateUserDto is defined in types, if not, infer from schema
type UpdateUserInput = z.infer<typeof updateUserSchema>;
// Assuming UpdateActiveWorkspaceDto is defined in types or schema exists
type UpdateActiveWorkspaceInput = UpdateActiveWorkspaceDto;

// Define the base API path
const BASE_PATH = '/v1/users';

export class UserService {
  async getMyProfile(): Promise<IUser> {
    try {
      const response = await api.get<IUser>(`${BASE_PATH}/me`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUser> {
    try {
      const response = await api.get<IUser>(`${BASE_PATH}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  }

  async updateMyProfile(data: UpdateUserInput): Promise<{ message: string }> {
    try {
      // updateUserSchema might need refinement based on API requirements
      updateUserSchema.parse(data);
      // The API uses PATCH /users with userId implicitly from token
      const response = await api.patch<{ message: string }>(
        `${BASE_PATH}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  async updateActiveWorkspace(
    data: UpdateActiveWorkspaceInput
  ): Promise<IUser> {
    try {
      // Assuming validation schema exists or validation happens elsewhere
      const response = await api.patch<IUser>(
        `${BASE_PATH}/me/active-workspace`,
        data
      );
      Cookies.set('Workspace', data.workspaceId as string, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update active workspace:', error);
      throw error;
    }
  }

  // Add other methods like getAllUsers, deleteUser, activateUser if needed (likely admin)
}

// Export a singleton instance
export const userService = new UserService();
