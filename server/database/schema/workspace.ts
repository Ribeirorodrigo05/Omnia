import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { user } from './auth'

export const workspacesTable = pgTable(
  'workspaces',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('workspaces_id_idx').on(table.id),
    index('workspaces_owner_id_idx').on(table.ownerId),
  ]
)
