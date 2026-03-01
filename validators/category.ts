import { z } from 'zod'

export const categoryTypeSchema = z.enum(['folder', 'list', 'initiative'])

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(4, 'O nome precisa ter pelo menos 4 caracteres')
    .max(50, 'O nome pode ter no máximo 50 caracteres'),
  type: categoryTypeSchema,
})

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
export type CategoryType = z.infer<typeof categoryTypeSchema>
