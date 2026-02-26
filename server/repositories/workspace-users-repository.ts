import 'server-only'

import { eq } from 'drizzle-orm'

import { db } from '@/server/database'
import { workspaceUsersTable } from '@/server/database/schema'
import type { NewWorkspaceUser, WorkspaceUser } from '@/server/types'

type WorkspaceUserIdentifier = Pick<WorkspaceUser, 'workspaceId' | 'userId'>

export const workspaceUsersRepository = {
  async findByUserId(userId: WorkspaceUser['userId']): Promise<WorkspaceUserIdentifier[]> {
    return db
      .select({
        workspaceId: workspaceUsersTable.workspaceId,
        userId: workspaceUsersTable.userId,
      })
      .from(workspaceUsersTable)
      .where(eq(workspaceUsersTable.userId, userId))
  },

  async create(data: NewWorkspaceUser): Promise<WorkspaceUser> {
    const [workspaceUser] = await db
      .insert(workspaceUsersTable)
      .values(data)
      .returning()
    return workspaceUser
  },
}
