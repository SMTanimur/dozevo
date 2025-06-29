// Represents the data structure for a single document response
export interface IDoc {
  _id: string;
  name: string;
  workspace: string; // Workspace ID as string
  space: string; // Space ID as string
  list?: string; // List ID as string (optional)
  content?: Record<string, unknown> | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Represents the data structure for a list of documents response
export interface IDocListResponse {
  data: IDoc[];
  total: number; // Total count for pagination
}
