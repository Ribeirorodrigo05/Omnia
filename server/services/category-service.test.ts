import { describe, it, expect, vi, beforeEach } from 'vitest'

import { categoryService } from './category-service'
import { categoryRepository } from '../repositories/category-repository'
import type { Category } from '@/server/types'

vi.mock('server-only', () => ({}))
vi.mock('@/server/database', () => ({
  db: {},
}))
vi.mock('@/server/repositories/category-repository')

const MOCK_SPACE_ID = 'a0000000-0000-4000-8000-000000000001'
const MOCK_SPACE_ID_2 = 'a0000000-0000-4000-8000-000000000002'
const MOCK_CATEGORY_ID = 'a0000000-0000-4000-8000-000000000010'
const MOCK_USER_ID = 'user-1'

const mockCategory: Category = {
  id: MOCK_CATEGORY_ID,
  name: 'Sprint 01',
  icon: 'folder',
  type: 'folder',
  spaceId: MOCK_SPACE_ID,
  creatorId: MOCK_USER_ID,
  startedAt: null,
  endsAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getById', () => {
    it('deve retornar uma categoria pelo id', async () => {
      vi.mocked(categoryRepository.findById).mockResolvedValue(mockCategory)

      const result = await categoryService.getById(MOCK_CATEGORY_ID)

      expect(result).toEqual(mockCategory)
      expect(categoryRepository.findById).toHaveBeenCalledWith(MOCK_CATEGORY_ID)
    })

    it('deve retornar undefined quando a categoria não existe', async () => {
      vi.mocked(categoryRepository.findById).mockResolvedValue(undefined)

      const result = await categoryService.getById('inexistente')

      expect(result).toBeUndefined()
    })
  })

  describe('getBySpaceId', () => {
    it('deve retornar todas as categorias de um space', async () => {
      vi.mocked(categoryRepository.findBySpaceId).mockResolvedValue([mockCategory])

      const result = await categoryService.getBySpaceId(MOCK_SPACE_ID)

      expect(result).toEqual([mockCategory])
      expect(categoryRepository.findBySpaceId).toHaveBeenCalledWith(MOCK_SPACE_ID)
    })

    it('deve retornar lista vazia quando o space não possui categorias', async () => {
      vi.mocked(categoryRepository.findBySpaceId).mockResolvedValue([])

      const result = await categoryService.getBySpaceId(MOCK_SPACE_ID)

      expect(result).toEqual([])
    })
  })

  describe('create', () => {
    it('deve criar uma categoria do tipo folder', async () => {
      vi.mocked(categoryRepository.create).mockResolvedValue(mockCategory)

      const result = await categoryService.create(
        { name: 'Sprint 01', type: 'folder', spaceId: MOCK_SPACE_ID },
        MOCK_USER_ID
      )

      expect(categoryRepository.create).toHaveBeenCalledWith({
        name: 'Sprint 01',
        type: 'folder',
        spaceId: MOCK_SPACE_ID,
        creatorId: MOCK_USER_ID,
      })
      expect(result).toEqual(mockCategory)
    })

    it('deve criar uma categoria do tipo initiative com datas', async () => {
      const startedAt = new Date('2026-03-01')
      const endsAt = new Date('2026-03-31')
      const mockInitiative: Category = {
        ...mockCategory,
        type: 'initiative',
        startedAt,
        endsAt,
      }
      vi.mocked(categoryRepository.create).mockResolvedValue(mockInitiative)

      const result = await categoryService.create(
        { name: 'Q1 Goals', type: 'initiative', spaceId: MOCK_SPACE_ID, startedAt, endsAt },
        MOCK_USER_ID
      )

      expect(categoryRepository.create).toHaveBeenCalledWith({
        name: 'Q1 Goals',
        type: 'initiative',
        spaceId: MOCK_SPACE_ID,
        startedAt,
        endsAt,
        creatorId: MOCK_USER_ID,
      })
      expect(result).toEqual(mockInitiative)
    })

    it('deve lançar erro sem nome', async () => {
      await expect(
        categoryService.create({ type: 'folder', spaceId: MOCK_SPACE_ID }, MOCK_USER_ID)
      ).rejects.toThrow()
    })

    it('deve lançar erro sem spaceId', async () => {
      await expect(
        categoryService.create({ name: 'Sprint 01', type: 'folder' }, MOCK_USER_ID)
      ).rejects.toThrow()
    })

    it('deve lançar erro com tipo inválido', async () => {
      await expect(
        categoryService.create({ name: 'Test', type: 'invalid', spaceId: MOCK_SPACE_ID }, MOCK_USER_ID)
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('deve atualizar o nome da categoria', async () => {
      const updated = { ...mockCategory, name: 'Sprint 02' }
      vi.mocked(categoryRepository.update).mockResolvedValue(updated)

      const result = await categoryService.update(MOCK_CATEGORY_ID, { name: 'Sprint 02' })

      expect(categoryRepository.update).toHaveBeenCalledWith(MOCK_CATEGORY_ID, { name: 'Sprint 02' })
      expect(result).toEqual(updated)
    })
  })

  describe('updateIcon', () => {
    it('deve atualizar o ícone da categoria', async () => {
      const updated = { ...mockCategory, icon: 'rocket' }
      vi.mocked(categoryRepository.update).mockResolvedValue(updated)

      const result = await categoryService.updateIcon(MOCK_CATEGORY_ID, 'rocket')

      expect(categoryRepository.update).toHaveBeenCalledWith(MOCK_CATEGORY_ID, { icon: 'rocket' })
      expect(result).toEqual(updated)
    })

    it('deve retornar undefined quando a categoria não existe', async () => {
      vi.mocked(categoryRepository.update).mockResolvedValue(undefined)

      const result = await categoryService.updateIcon('inexistente', 'star')
      expect(result).toBeUndefined()
    })
  })

  describe('getBySpaceIds', () => {
    it('deve retornar categorias agrupadas por spaceId', async () => {
      const cat2: Category = { ...mockCategory, id: 'cat-2', spaceId: MOCK_SPACE_ID_2 }
      vi.mocked(categoryRepository.findBySpaceIds).mockResolvedValue([mockCategory, cat2])

      const result = await categoryService.getBySpaceIds([MOCK_SPACE_ID, MOCK_SPACE_ID_2])

      expect(result).toEqual({
        [MOCK_SPACE_ID]: [mockCategory],
        [MOCK_SPACE_ID_2]: [cat2],
      })
    })

    it('deve retornar objeto vazio quando não há spaceIds', async () => {
      vi.mocked(categoryRepository.findBySpaceIds).mockResolvedValue([])

      const result = await categoryService.getBySpaceIds([])

      expect(result).toEqual({})
    })
  })

  describe('delete', () => {
    it('deve realizar soft delete da categoria', async () => {
      vi.mocked(categoryRepository.softDelete).mockResolvedValue(undefined)

      await categoryService.delete(MOCK_CATEGORY_ID)

      expect(categoryRepository.softDelete).toHaveBeenCalledWith(MOCK_CATEGORY_ID)
    })
  })
})
