import 'server-only'

import { eq } from 'drizzle-orm'

import { db } from '@/server/database'
import { workspacesTable } from '@/server/database/schema'
import type { NewWorkspace, Workspace } from '@/server/types'

export const workspaceRepository = {
  async findById(id: Workspace['id']): Promise<Workspace | undefined> {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, id))
    return workspace
  },

  async create(data: NewWorkspace): Promise<Workspace> {
    const [workspace] = await db.insert(workspacesTable).values(data).returning()
    return workspace
  },
}
