import { z } from 'zod';

// Schema for validating user ID parameter
export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(Number)
    .refine(id => id > 0, 'ID must be a positive number'),
});

// Schema for validating update user requests
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(255, 'Name must not exceed 255 characters')
      .trim()
      .optional(),

    email: z
      .string()
      .email('Please provide a valid email address')
      .max(255, 'Email must not exceed 255 characters')
      .toLowerCase()
      .trim()
      .optional(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(128, 'Password must not exceed 128 characters')
      .optional(),

    role: z
      .enum(['user', 'admin'], {
        errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
      })
      .optional(),
  })
  .refine(
    data => {
      // Ensure at least one field is provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// Schema for query parameters (useful for filtering, pagination, etc.)
export const getUsersQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a valid number')
    .transform(Number)
    .refine(page => page > 0, 'Page must be a positive number')
    .optional()
    .default('1'),

  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a valid number')
    .transform(Number)
    .refine(
      limit => limit > 0 && limit <= 100,
      'Limit must be between 1 and 100'
    )
    .optional()
    .default('10'),

  role: z.enum(['user', 'admin']).optional(),
});
