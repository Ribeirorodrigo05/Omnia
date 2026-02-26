import { createInsertSchema } from 'drizzle-zod'

import {
  spacesTable,
  spaceUsersTable,
  workspacesTable,
  workspaceUsersTable,
} from '@/server/database/schema'
import type { account, session, user, verification } from '@/server/database/schema'

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert

export type Account = typeof account.$inferSelect
export type NewAccount = typeof account.$inferInsert

export type Verification = typeof verification.$inferSelect
export type NewVerification = typeof verification.$inferInsert

export type Workspace = typeof workspacesTable.$inferSelect
export type NewWorkspace = typeof workspacesTable.$inferInsert

export type WorkspaceUser = typeof workspaceUsersTable.$inferSelect
export type NewWorkspaceUser = typeof workspaceUsersTable.$inferInsert

export type Space = typeof spacesTable.$inferSelect
export type NewSpace = typeof spacesTable.$inferInsert

export type SpaceUser = typeof spaceUsersTable.$inferSelect
export type NewSpaceUser = typeof spaceUsersTable.$inferInsert

export const insertWorkspaceSchema = createInsertSchema(workspacesTable)
export const insertWorkspaceUserSchema = createInsertSchema(workspaceUsersTable)
export const insertSpaceSchema = createInsertSchema(spacesTable)
export const insertSpaceUserSchema = createInsertSchema(spaceUsersTable)
