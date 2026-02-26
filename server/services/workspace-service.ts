import 'server-only'

import { workspaceRepository } from '@/server/repositories/workspace-repository'
import { workspaceUsersRepository } from '@/server/repositories/workspace-users-repository'
import { insertWorkspaceSchema } from '@/server/types'
import type { Workspace } from '@/server/types'

const WORKSPACE_NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/

const createWorkspaceSchema = insertWorkspaceSchema
  .pick({ name: true })
  .refine((data) => WORKSPACE_NAME_REGEX.test(data.name), {
    message: 'Apenas letras e espaços são permitidos',
    path: ['name'],
  })

export const workspaceService = {
  async create(data: unknown, ownerId: string): Promise<Workspace> {
    const validated = createWorkspaceSchema.parse(data)

    const workspace = await workspaceRepository.create({
      name: validated.name,
      ownerId,
    })

    await workspaceUsersRepository.create({
      workspaceId: workspace.id,
      userId: ownerId,
      role: 'owner',
      authorization: ['read_only', 'write', 'delete'],
    })

    return workspace
  },
}
