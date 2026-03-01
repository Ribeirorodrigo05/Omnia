import 'server-only'

import { and, eq, inArray, isNull } from 'drizzle-orm'

import { db } from '@/server/database'
import { categoriesTable } from '@/server/database/schema'
import type { Category, NewCategory } from '@/server/types'

export const categoryRepository = {
  async findById(id: Category['id']): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categoriesTable)
      .where(and(eq(categoriesTable.id, id), isNull(categoriesTable.deletedAt)))
    return category
  },

  async findBySpaceId(spaceId: Category['spaceId']): Promise<Category[]> {
    return db
      .select()
      .from(categoriesTable)
      .where(
        and(eq(categoriesTable.spaceId, spaceId), isNull(categoriesTable.deletedAt))
      )
  },

  async findBySpaceIds(spaceIds: Category['spaceId'][]): Promise<Category[]> {
    if (spaceIds.length === 0) return []
    return db
      .select()
      .from(categoriesTable)
      .where(
        and(inArray(categoriesTable.spaceId, spaceIds), isNull(categoriesTable.deletedAt))
      )
  },

  async create(data: NewCategory): Promise<Category> {
    const [category] = await db.insert(categoriesTable).values(data).returning()
    return category
  },

  async update(id: Category['id'], data: Partial<NewCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categoriesTable)
      .set(data)
      .where(and(eq(categoriesTable.id, id), isNull(categoriesTable.deletedAt)))
      .returning()
    return category
  },

  async softDelete(id: Category['id']): Promise<void> {
    await db
      .update(categoriesTable)
      .set({ deletedAt: new Date() })
      .where(eq(categoriesTable.id, id))
  },
}
