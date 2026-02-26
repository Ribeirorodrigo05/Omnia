import 'server-only'

import { spaceRepository } from '@/server/repositories/space-repository'
import { spaceUsersRepository } from '@/server/repositories/space-users-repository'
import { insertSpaceSchema } from '@/server/types'
import type { Space } from '@/server/types'

export const spaceService = {
  async getById(id: Space['id']): Promise<Space | undefined> {
    return spaceRepository.findById(id)
  },

  async getByWorkspaceId(workspaceId: Space['workspaceId']): Promise<Space[]> {
    return spaceRepository.findByWorkspaceId(workspaceId)
  },

  async create(data: unknown, creatorId: string): Promise<Space> {
    const validated = insertSpaceSchema
      .pick({ name: true, workspaceId: true })
      .parse(data)

    const space = await spaceRepository.create({
      ...validated,
      creatorId,
    })

    await spaceUsersRepository.create({
      spaceId: space.id,
      userId: creatorId,
      role: 'owner',
      authorization: ['read_only', 'write', 'delete'],
    })

    return space
  },

  async update(id: Space['id'], data: unknown): Promise<Space | undefined> {
    const validated = insertSpaceSchema.pick({ name: true }).partial().parse(data)
    return spaceRepository.update(id, validated)
  },

  async delete(id: Space['id']): Promise<void> {
    return spaceRepository.softDelete(id)
  },
}
