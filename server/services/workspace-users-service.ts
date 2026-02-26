import 'server-only'

import { workspaceUsersRepository } from '@/server/repositories/workspace-users-repository'
import type { WorkspaceUser } from '@/server/types'

export const workspaceUsersService = {
  async hasWorkspace(userId: WorkspaceUser['userId']): Promise<boolean> {
    const memberships = await workspaceUsersRepository.findByUserId(userId)
    return memberships.length > 0
  },
}
