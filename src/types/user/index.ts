import { userSchema } from '@/validations';
import { z } from 'zod';


export enum Role {
    ADMIN = 'admin',
    USER = 'user',
  }

  
  // Represents the data returned for a single user profile
export interface IUser{
    id: string; // Typically the MongoDB _id as a string
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isActive: boolean;
    roles: Role[];
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    activeWorkspace?: string | null; // ID of the active workspace
    // Add other non-sensitive fields as needed
  }

// Represents the DTO for updating the active workspace
export interface UpdateActiveWorkspaceDto {
  workspaceId: string | null; // ID of the workspace, or null to clear
}

// Type derived from the Zod schema
export type User = z.infer<typeof userSchema>;