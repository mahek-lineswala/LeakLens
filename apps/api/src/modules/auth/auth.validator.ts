import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email('Please provide a valid email address.'),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters long.'),
    firstName: z
      .string({ required_error: 'First name is required.' })
      .min(1, 'First name cannot be empty.'),
    lastName: z
      .string({ required_error: 'Last name is required.' })
      .min(1, 'Last name cannot be empty.'),
    organizationName: z
      .string()
      .min(2, 'Organization name must be at least 2 characters long.')
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email('Please provide a valid email address.'),
    password: z
      .string({ required_error: 'Password is required.' }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
