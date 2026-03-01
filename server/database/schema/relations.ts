import { relations } from 'drizzle-orm'

import { user } from './auth'
import { workspacesTable } from './workspace'
import { workspaceUsersTable } from './workspace-users'
import { spacesTable } from './space'
import { spaceUsersTable } from './space-users'
import { categoriesTable } from './category'

export const workspacesRelations = relations(workspacesTable, ({ one, many }) => ({
  owner: one(user, {
    fields: [workspacesTable.ownerId],
    references: [user.id],
  }),
  members: many(workspaceUsersTable),
  spaces: many(spacesTable),
}))

export const usersRelations = relations(user, ({ many }) => ({
  workspaces: many(workspacesTable),
  workspaceUsers: many(workspaceUsersTable),
  spaceUsers: many(spaceUsersTable),
  categories: many(categoriesTable),
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

export const spacesRelations = relations(spacesTable, ({ one, many }) => ({
  workspace: one(workspacesTable, {
    fields: [spacesTable.workspaceId],
    references: [workspacesTable.id],
  }),
  creator: one(user, {
    fields: [spacesTable.creatorId],
    references: [user.id],
  }),
  members: many(spaceUsersTable),
  categories: many(categoriesTable),
}))

export const spaceUsersRelations = relations(spaceUsersTable, ({ one }) => ({
  space: one(spacesTable, {
    fields: [spaceUsersTable.spaceId],
    references: [spacesTable.id],
  }),
  user: one(user, {
    fields: [spaceUsersTable.userId],
    references: [user.id],
  }),
}))

export const categoriesRelations = relations(categoriesTable, ({ one }) => ({
  space: one(spacesTable, {
    fields: [categoriesTable.spaceId],
    references: [spacesTable.id],
  }),
  creator: one(user, {
    fields: [categoriesTable.creatorId],
    references: [user.id],
  }),
}))
