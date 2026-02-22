import { index, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { workspacesTable } from './workspace'

export const workspaceRoleEnum = pgEnum('workspace_role', [
  'owner',
  'super_admin',
  'admin',
  'member',
])

export const workspaceAuthorizationEnum = pgEnum('workspace_authorization', [
  'read_only',
  'write',
  'delete',
])

export const workspaceUsersTable = pgTable(
  'workspace_users',
  {
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspacesTable.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: workspaceRoleEnum('role').notNull(),
    authorization: workspaceAuthorizationEnum('authorization').array().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.workspaceId, table.userId] }),
    index('workspace_users_workspace_id_idx').on(table.workspaceId),
    index('workspace_users_user_id_idx').on(table.userId),
  ]
)
