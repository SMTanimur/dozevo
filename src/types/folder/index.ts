import { IStatusDefinition } from "../space";


// Represents the data structure for a single folder response
export interface IFolder {
  _id: string; // Or map to 'id'
  workspace: string; // Workspace ID as string
  space: string; // Space ID as string
  name: string;
  statuses?: IStatusDefinition[]; // Optional override statuses
  hidden: boolean;
  orderIndex?: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Represents the data structure for a list of folders response
export interface FolderListResponse {
  data: IFolder[];
  total: number; // Total count for pagination
  // Add other pagination fields if needed
}
