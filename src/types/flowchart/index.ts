// Represents the data structure for a single flowchart/whiteboard diagram
export interface IFlowchart {
  _id: string;
  name: string;
  workspace: string; // Workspace ID
  space: string; // Space ID
  list?: string | null; // List ID (optional)
  data?: Record<string, any> | null; // React Flow nodes, edges, or custom drawing data
  createdAt: string;
  updatedAt: string;
}
