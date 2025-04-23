import { z } from 'zod';
import {
  spaceSchema,
  statusDefinitionSchema,
  spaceFeaturesConfigSchema,
  statusTypeSchema,
} from '@/validations/space';
import { IList } from '../list';

// Represents a status definition in a response
export interface IStatusDefinition {
    id: string;
    name: string;
    color: string;
    order: number;
    type: string; // e.g., 'open', 'done'
  }
  
  // Represents a member within a space context in a response
  export interface ISpaceMember {
    userId: string; // User ID as string
    role: string; // e.g., 'admin', 'member'
    // You might add populated user details here if needed later
    // firstName?: string;
    // lastName?: string;
    // avatar?: string;
  }
  
  // Represents the data structure for a single space response
  export interface ISpace {
    _id: string; // Or map to 'id' during transformation
    workspace: string; // Workspace ID as string
    name: string;
    members?: ISpaceMember[]; // Array of space members
    icon: string;
    color: string;
    lists?: IList[];
    statuses: IStatusDefinition[]; // Array of status definitions
    features?: Record<string, boolean>; // Enabled features
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }
  
  // Represents the data structure for a list of spaces response
  export interface ISpaceListResponse {
    data: ISpace[]; // Could be a simplified version of Space if needed
    total: number; // Total count for pagination
    // Add other pagination fields like page, limit if needed
  }
  
// Type derived from the Zod schema
export type StatusType = z.infer<typeof statusTypeSchema>;

// Type derived from the Zod schema
export type StatusDefinition = z.infer<typeof statusDefinitionSchema>;

// Type derived from the Zod schema
export type SpaceFeaturesConfig = z.infer<typeof spaceFeaturesConfigSchema>;

// Type derived from the Zod schema
export type Space = z.infer<typeof spaceSchema>;
  