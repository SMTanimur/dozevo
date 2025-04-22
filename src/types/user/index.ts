import { z } from 'zod';
import { userSchema } from '@/validations/user';

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
  }

  
  // Represents the data returned for a single user profile
export interface IUser {
    id: string; // Typically the MongoDB _id as a string
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isActive: boolean;
    roles: Role[];
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    activeWorkspace?: string | null; // Add optional active workspace ID
    // Add other non-sensitive fields as needed
  }

// Type derived from the Zod schema
export type User = z.infer<typeof userSchema>;