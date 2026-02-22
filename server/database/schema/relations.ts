import { relations } from 'drizzle-orm'

import { user } from './auth'
import { workspacesTable } from './workspace'

export const workspacesRelations = relations(workspacesTable, ({ one }) => ({
  owner: one(user, {
    fields: [workspacesTable.ownerId],
    references: [user.id],
  }),
}))

export const usersRelations = relations(user, ({ many }) => ({
  workspaces: many(workspacesTable),
}))
