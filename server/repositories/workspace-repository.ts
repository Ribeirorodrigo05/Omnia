import 'server-only'

import { db } from '@/server/database'
import { workspacesTable } from '@/server/database/schema'
import type { NewWorkspace, Workspace } from '@/server/types'

export const workspaceRepository = {
  async create(data: NewWorkspace): Promise<Workspace> {
    const [workspace] = await db.insert(workspacesTable).values(data).returning()
    return workspace
  },
}
