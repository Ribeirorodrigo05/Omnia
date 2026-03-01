import { z } from 'zod'

export const renameSpaceSchema = z.object({
  name: z
    .string()
    .min(4, 'O nome precisa ter pelo menos 4 caracteres')
    .max(50, 'O nome pode ter no máximo 50 caracteres'),
})

export type RenameSpaceFormData = z.infer<typeof renameSpaceSchema>
