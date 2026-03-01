import 'server-only'

import { workspaceUsersRepository } from '@/server/repositories/workspace-users-repository'
import type { WorkspaceUser } from '@/server/types'

export const workspaceUsersService = {
  async hasWorkspace(userId: WorkspaceUser['userId']): Promise<boolean> {
    const memberships = await workspaceUsersRepository.findByUserId(userId)
    return memberships.length > 0
  },

  async getMembership(userId: WorkspaceUser['userId']): Promise<WorkspaceUser | undefined> {
    const memberships = await workspaceUsersRepository.findFullByUserId(userId)
    return memberships[0]
  },

  async hasWritePermission(userId: WorkspaceUser['userId']): Promise<boolean> {
    const membership = await this.getMembership(userId)
    if (!membership) return false
    return membership.authorization.includes('write')
  },
}
