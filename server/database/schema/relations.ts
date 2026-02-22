import { relations } from 'drizzle-orm'

import { user } from './auth'
import { workspacesTable } from './workspace'
import { workspaceUsersTable } from './workspace-users'

export const workspacesRelations = relations(workspacesTable, ({ one, many }) => ({
  owner: one(user, {
    fields: [workspacesTable.ownerId],
    references: [user.id],
  }),
  members: many(workspaceUsersTable),
}))

export const usersRelations = relations(user, ({ many }) => ({
  workspaces: many(workspacesTable),
  workspaceUsers: many(workspaceUsersTable),
}))

export const workspaceUsersRelations = relations(workspaceUsersTable, ({ one }) => ({
  workspace: one(workspacesTable, {
    fields: [workspaceUsersTable.workspaceId],
    references: [workspacesTable.id],
  }),
  user: one(user, {
    fields: [workspaceUsersTable.userId],
    references: [user.id],
  }),
}))
