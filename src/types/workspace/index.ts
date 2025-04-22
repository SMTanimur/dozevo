import { z } from 'zod';
import {
  workspaceSchema,
  workspaceMemberSchema,
  customRoleSchema,
} from '@/validations/workspace';

export enum WorkspaceRole {
    ADMIN = 'admin',
    MEMBER = 'member',
    // Add GUEST later if needed
  } 


  interface WorkspaceMemberDto {
    userId: string;
    role: WorkspaceRole;
    // joinedAt?: string; // Optionally include join date as ISO string
  }
  
  // Represents the data returned for a single workspace
  export interface WorkspaceDto {
    _id: string; // Use 'id' instead of '_id' after mapping
    name: string;
    description?: string; // Make optional as it is in schema
    owner: string; // User ID of the owner
    members: WorkspaceMemberDto[]; // Array of simplified member info
    // spaces: string[]; // Optionally include array of Space IDs
    // settings?: Record<string, any>; // Optionally include settings
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }
  
// Type derived from the Zod schema
export type CustomRole = z.infer<typeof customRoleSchema>;

// Type derived from the Zod schema
export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;

// Type derived from the Zod schema
export type Workspace = z.infer<typeof workspaceSchema>;

// You can also define types for create/update if needed
// export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
// export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
  