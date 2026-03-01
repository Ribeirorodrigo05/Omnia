import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { workspacesTable } from './workspace'

export const spacesTable = pgTable(
  'spaces',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 50 }).notNull().default('folder-kanban'),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspacesTable.id, { onDelete: 'cascade' }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('spaces_id_idx').on(table.id),
    index('spaces_workspace_id_idx').on(table.workspaceId),
    index('spaces_creator_id_idx').on(table.creatorId),
  ]
)
