import 'server-only'

import { and, eq, isNull, inArray } from 'drizzle-orm'

import { db } from '@/server/database'
import { spacesTable, spaceUsersTable } from '@/server/database/schema'
import type { NewSpace, Space } from '@/server/types'

export const spaceRepository = {
  async findById(id: Space['id']): Promise<Space | undefined> {
    const [space] = await db
      .select()
      .from(spacesTable)
      .where(and(eq(spacesTable.id, id), isNull(spacesTable.deletedAt)))
    return space
  },

  async findByWorkspaceId(workspaceId: Space['workspaceId']): Promise<Space[]> {
    return db
      .select()
      .from(spacesTable)
      .where(
        and(eq(spacesTable.workspaceId, workspaceId), isNull(spacesTable.deletedAt))
      )
  },

  async findByUserId(userId: string): Promise<Space[]> {
    const memberSpaceIds = db
      .select({ spaceId: spaceUsersTable.spaceId })
      .from(spaceUsersTable)
      .where(
        and(eq(spaceUsersTable.userId, userId), isNull(spaceUsersTable.deletedAt))
      )

    return db
      .select()
      .from(spacesTable)
      .where(
        and(inArray(spacesTable.id, memberSpaceIds), isNull(spacesTable.deletedAt))
      )
  },

  async create(data: NewSpace): Promise<Space> {
    const [space] = await db.insert(spacesTable).values(data).returning()
    return space
  },

  async update(id: Space['id'], data: Partial<NewSpace>): Promise<Space | undefined> {
    const [space] = await db
      .update(spacesTable)
      .set(data)
      .where(and(eq(spacesTable.id, id), isNull(spacesTable.deletedAt)))
      .returning()
    return space
  },

  async softDelete(id: Space['id']): Promise<void> {
    await db
      .update(spacesTable)
      .set({ deletedAt: new Date() })
      .where(eq(spacesTable.id, id))
  },
}
