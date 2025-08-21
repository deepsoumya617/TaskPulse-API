import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(5, 'Title is required.')
    .max(100, 'Title must be less than 100 characters'),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
})
