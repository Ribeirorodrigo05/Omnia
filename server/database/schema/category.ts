import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { user } from './auth'
import { spacesTable } from './space'

export const categoryTypeEnum = pgEnum('category_type', [
  'folder',
  'list',
  'initiative',
])

export const categoriesTable = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 50 }).notNull().default('folder'),
    type: categoryTypeEnum('type').notNull(),
    spaceId: uuid('space_id')
      .notNull()
      .references(() => spacesTable.id, { onDelete: 'cascade' }),
    creatorId: text('creator_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at'),
    endsAt: timestamp('ends_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('categories_id_idx').on(table.id),
    index('categories_space_id_idx').on(table.spaceId),
    index('categories_creator_id_idx').on(table.creatorId),
    index('categories_type_idx').on(table.type),
  ]
)
