import 'server-only'

import { categoryRepository } from '@/server/repositories/category-repository'
import { insertCategorySchema } from '@/server/types'
import type { Category } from '@/server/types'

export const categoryService = {
  async getById(id: Category['id']): Promise<Category | undefined> {
    return categoryRepository.findById(id)
  },

  async getBySpaceId(spaceId: Category['spaceId']): Promise<Category[]> {
    return categoryRepository.findBySpaceId(spaceId)
  },

  async getBySpaceIds(spaceIds: Category['spaceId'][]): Promise<Record<string, Category[]>> {
    const categories = await categoryRepository.findBySpaceIds(spaceIds)
    const grouped: Record<string, Category[]> = {}
    for (const category of categories) {
      if (!grouped[category.spaceId]) {
        grouped[category.spaceId] = []
      }
      grouped[category.spaceId].push(category)
    }
    return grouped
  },

  async create(data: unknown, creatorId: string): Promise<Category> {
    const validated = insertCategorySchema
      .pick({ name: true, type: true, spaceId: true, startedAt: true, endsAt: true })
      .parse(data)

    return categoryRepository.create({
      ...validated,
      creatorId,
    })
  },

  async update(id: Category['id'], data: unknown): Promise<Category | undefined> {
    const validated = insertCategorySchema
      .pick({ name: true, icon: true, startedAt: true, endsAt: true })
      .partial()
      .parse(data)
    return categoryRepository.update(id, validated)
  },

  async updateIcon(id: Category['id'], icon: string): Promise<Category | undefined> {
    const validated = insertCategorySchema.pick({ icon: true }).parse({ icon })
    return categoryRepository.update(id, validated)
  },

  async delete(id: Category['id']): Promise<void> {
    return categoryRepository.softDelete(id)
  },
}
