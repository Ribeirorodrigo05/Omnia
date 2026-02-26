import { z } from 'zod'

const WORKSPACE_NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .regex(WORKSPACE_NAME_REGEX, 'Apenas letras e espaços são permitidos'),
})

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>
