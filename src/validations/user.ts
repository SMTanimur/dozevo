import { z } from 'zod';

// Based on PopulatedUserDto used in API responses
export const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(), // Assuming lastName might be optional
  avatar: z.string().url().optional().nullable(),
  // Add email or other fields if they are consistently included in populated user DTOs
}); 