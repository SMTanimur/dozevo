 // Adjust path if needed

export interface IStatusDefinition {
  _id: string;
  status: string;
  color: string;
  listId: string;
  orderindex: number;
  type: StatusType;
}



export enum StatusType {
  OPEN = 'open',
  CUSTOM = 'custom',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  CLOSED = 'closed',
  DONE = 'done',
}