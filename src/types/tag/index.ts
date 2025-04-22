import { z } from 'zod';
import { tagSchema } from '@/validations/tag';

// Type derived from the Zod schema
export type Tag = z.infer<typeof tagSchema>;

// export type CreateTagInput = z.infer<typeof createTagSchema>;
// export type UpdateTagInput = z.infer<typeof updateTagSchema>; 