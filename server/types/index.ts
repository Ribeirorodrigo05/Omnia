import type { account, session, user, verification, workspacesTable, workspaceUsersTable } from '@/server/database/schema'

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
