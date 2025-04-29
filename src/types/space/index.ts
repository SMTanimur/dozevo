import { z } from 'zod';
import {
  spaceSchema,
  spaceFeaturesConfigSchema,

} from '@/validations/space';
import { IList } from '../list';


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
    avatar: string;
    color: string;
    description: string;
    private: boolean;
    archived: boolean;
    multiple_assignees: boolean;
    lists?: IList[];
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
export type SpaceFeaturesConfig = z.infer<typeof spaceFeaturesConfigSchema>;

// Type derived from the Zod schema
export type Space = z.infer<typeof spaceSchema>;
  