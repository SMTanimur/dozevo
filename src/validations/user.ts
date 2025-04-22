import { z } from 'zod';



export const userSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a valid string',
    })
    .trim()
    .min(2, { message: 'First name is must be 2 or more characters long' }),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .trim()
    .email({ message: 'Invalid email address' }),

  lastName: z

    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a valid string',
    })
    .trim()
    .min(2, { message: 'Last name is must be 2 or more characters long' }),
  avatar: z

    .string({
      required_error: 'Avatar  is required',
      invalid_type_error: 'Avatar  must be a valid string',
    })
    .trim()
    .min(2, { message: 'Avatar  is must be 2 or more characters long' }),
  contact: z

    .string({
      invalid_type_error: 'Contact  must be a valid string',
    })
    .min(11, { message: 'Contact  is must be 2 or more characters long' }),
  password: z

    .string({
      required_error: 'Password  is required',
      invalid_type_error: 'Password  must be a valid string',
    })
    .trim()
    .min(8, { message: 'Password  is must be 2 or more characters long' }),
});
export const createUserSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  contact: true,
  password: true,
  
});

export const loginSchema = userSchema.omit({
  firstName: true,
  lastName: true,
  avatar: true,
  contact: true,
});





export type TLogin = z.infer<typeof loginSchema>;

export type TCreateUser = z.infer<typeof createUserSchema>;
// Based on PopulatedUserDto used in API responses
export const userDtoSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(), // Assuming lastName might be optional
  avatar: z.string().url().optional().nullable(),
  // Add email or other fields if they are consistently included in populated user DTOs
});

// Schema for updating a user (based on UpdateUserDto)
export const updateUserSchema = z
  .object({
    firstName: z.string().min(1, 'First name cannot be empty').trim().optional(),
    lastName: z.string().min(1, 'Last name cannot be empty').trim().optional(),
    avatar: z.string().url('Invalid avatar URL').nullable().optional(),
    // Add other fields like password changes if needed, but handle separately
    // userId is usually handled by the backend from the authenticated user
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Add other schemas if needed, e.g., for CreateUserDto (if used on frontend)
// export const createUserSchema = z.object({...}); 