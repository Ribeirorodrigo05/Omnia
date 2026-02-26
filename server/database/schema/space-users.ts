import { index, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { spacesTable } from './space'

export const spaceRoleEnum = pgEnum('space_role', [
  'owner',
  'super_admin',
  'admin',
  'member',
])

export const spaceAuthorizationEnum = pgEnum('space_authorization', [
  'read_only',
  'write',
  'delete',
])

export const spaceUsersTable = pgTable(
  'space_users',
  {
    spaceId: uuid('space_id')
      .notNull()
      .references(() => spacesTable.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: spaceRoleEnum('role').notNull(),
    authorization: spaceAuthorizationEnum('authorization').array().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    primaryKey({ columns: [table.spaceId, table.userId] }),
    index('space_users_space_id_idx').on(table.spaceId),
    index('space_users_user_id_idx').on(table.userId),
  ]
)
