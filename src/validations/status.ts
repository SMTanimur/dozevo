import { z } from "zod";

export const statusTypeSchema = z.enum([
  'open',
  'custom',
  'in_progress',
  'closed',
  'done',
]);

export const statusSchema = z.object({
  _id: z.string().optional(),
  status: z.string().min(1),
  color: z.string().min(1),
  orderindex: z.number().min(0),
  type: statusTypeSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})



export const createStatusSchema = statusSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
})

export type TCreateStatus = z.infer<typeof createStatusSchema>;

export const updateStatusSchema = statusSchema.partial().extend({
  _id: z.string(),
})

export type TUpdateStatus = z.infer<typeof updateStatusSchema>;





