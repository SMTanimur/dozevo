import { z } from 'zod';
import { statusSchema } from '@/validations/status'; // Adjust path if needed

export interface IStatusDefinition {
  _id: string;
  status: string;
  color: string;
  listId: string;
  orderindex: number;
  type: string;
}

export type TStatus = z.infer<typeof statusSchema>;
