import 'server-only'

import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/server/database'
import { spaceUsersTable } from '@/server/database/schema'
import type { NewSpaceUser, SpaceUser } from '@/server/types'

export const spaceUsersRepository = {
  async findBySpaceId(spaceId: SpaceUser['spaceId']): Promise<SpaceUser[]> {
    return db
      .select()
      .from(spaceUsersTable)
      .where(
        and(eq(spaceUsersTable.spaceId, spaceId), isNull(spaceUsersTable.deletedAt))
      )
  },

  async findByUserId(userId: SpaceUser['userId']): Promise<SpaceUser[]> {
    return db
      .select()
      .from(spaceUsersTable)
      .where(
        and(eq(spaceUsersTable.userId, userId), isNull(spaceUsersTable.deletedAt))
      )
  },

  async create(data: NewSpaceUser): Promise<SpaceUser> {
    const [spaceUser] = await db.insert(spaceUsersTable).values(data).returning()
    return spaceUser
  },

  async softDelete(spaceId: SpaceUser['spaceId'], userId: SpaceUser['userId']): Promise<void> {
    await db
      .update(spaceUsersTable)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(spaceUsersTable.spaceId, spaceId), eq(spaceUsersTable.userId, userId))
      )
  },
}
