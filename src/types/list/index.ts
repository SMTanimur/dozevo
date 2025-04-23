import { IStatusDefinition } from "../space";
import { z } from 'zod';
import { listSchema } from '@/validations/list';

// Type derived from the Zod schema
export type List = z.infer<typeof listSchema>;

// export type CreateFolderInput = z.infer<typeof createlistSchema>;
// export type UpdateFolderInput = z.infer<typeof updatelistSchema>;

// Represents the data structure for a single folder response
export interface IList {
  _id: string; // Or map to 'id'
  workspace: string; // Workspace ID as string
  space: string; // Space ID as string
  name: string;
  icon: string;
  color: string;
  statuses?: IStatusDefinition[]; // Optional override statuses
  hidden: boolean;
  orderIndex?: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Represents the data structure for a list of folders response
export interface ListListResponse {
  data: IList[];
  total: number; // Total count for pagination
  // Add other pagination fields if needed
}
