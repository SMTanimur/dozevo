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
  