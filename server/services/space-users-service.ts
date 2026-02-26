import 'server-only'

import { spaceUsersRepository } from '@/server/repositories/space-users-repository'
import { insertSpaceUserSchema } from '@/server/types'
import type { SpaceUser } from '@/server/types'

export const spaceUsersService = {
  async getBySpaceId(spaceId: SpaceUser['spaceId']): Promise<SpaceUser[]> {
    return spaceUsersRepository.findBySpaceId(spaceId)
  },

  async addMember(data: unknown): Promise<SpaceUser> {
    const validated = insertSpaceUserSchema
      .pick({ spaceId: true, userId: true, role: true, authorization: true })
      .parse(data)
    return spaceUsersRepository.create(validated)
  },

  async removeMember(
    spaceId: SpaceUser['spaceId'],
    userId: SpaceUser['userId']
  ): Promise<void> {
    return spaceUsersRepository.softDelete(spaceId, userId)
  },
}
