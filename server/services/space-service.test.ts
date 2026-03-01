import { describe, it, expect, vi, beforeEach } from 'vitest'

import { spaceService } from './space-service'
import { spaceRepository } from '../repositories/space-repository'
import { spaceUsersRepository } from '../repositories/space-users-repository'
import type { Space, SpaceUser } from '@/server/types'

vi.mock('server-only', () => ({}))
vi.mock('../repositories/space-repository')
vi.mock('../repositories/space-users-repository')

const mockSpace: Space = {
  id: 'space-1',
  name: 'Frontend',
  icon: 'folder-kanban',
  workspaceId: 'ws-1',
  creatorId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

const mockSpaceUser: SpaceUser = {
  spaceId: 'space-1',
  userId: 'user-1',
  role: 'owner',
  authorization: ['read_only', 'write', 'delete'],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

describe('spaceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getById', () => {
    it('deve retornar um space pelo id', async () => {
      vi.mocked(spaceRepository.findById).mockResolvedValue(mockSpace)

      const result = await spaceService.getById('space-1')

      expect(result).toEqual(mockSpace)
      expect(spaceRepository.findById).toHaveBeenCalledWith('space-1')
    })

    it('deve retornar undefined quando o space não existe', async () => {
      vi.mocked(spaceRepository.findById).mockResolvedValue(undefined)

      const result = await spaceService.getById('inexistente')

      expect(result).toBeUndefined()
    })
  })

  describe('getByWorkspaceId', () => {
    it('deve retornar todos os spaces de um workspace', async () => {
      vi.mocked(spaceRepository.findByWorkspaceId).mockResolvedValue([mockSpace])

      const result = await spaceService.getByWorkspaceId('ws-1')

      expect(result).toEqual([mockSpace])
      expect(spaceRepository.findByWorkspaceId).toHaveBeenCalledWith('ws-1')
    })
  })

  describe('getByUserId', () => {
    it('deve retornar todos os spaces do usuário', async () => {
      vi.mocked(spaceRepository.findByUserId).mockResolvedValue([mockSpace])

      const result = await spaceService.getByUserId('user-1')

      expect(result).toEqual([mockSpace])
      expect(spaceRepository.findByUserId).toHaveBeenCalledWith('user-1')
    })

    it('deve retornar lista vazia quando o usuário não possui spaces', async () => {
      vi.mocked(spaceRepository.findByUserId).mockResolvedValue([])

      const result = await spaceService.getByUserId('user-1')

      expect(result).toEqual([])
    })
  })

  describe('create', () => {
    it('deve criar um space e vincular o criador como owner', async () => {
      vi.mocked(spaceRepository.create).mockResolvedValue(mockSpace)
      vi.mocked(spaceUsersRepository.create).mockResolvedValue(mockSpaceUser)

      const result = await spaceService.create(
        { name: 'Frontend', workspaceId: 'ws-1' },
        'user-1'
      )

      expect(spaceRepository.create).toHaveBeenCalledWith({
        name: 'Frontend',
        workspaceId: 'ws-1',
        creatorId: 'user-1',
      })
      expect(spaceUsersRepository.create).toHaveBeenCalledWith({
        spaceId: 'space-1',
        userId: 'user-1',
        role: 'owner',
        authorization: ['read_only', 'write', 'delete'],
      })
      expect(result).toEqual(mockSpace)
    })

    it('deve lançar erro com nome vazio', async () => {
      await expect(
        spaceService.create({ name: '', workspaceId: 'ws-1' }, 'user-1')
      ).rejects.toThrow()
    })

    it('deve lançar erro sem workspaceId', async () => {
      await expect(
        spaceService.create({ name: 'Frontend' }, 'user-1')
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('deve atualizar o nome do space', async () => {
      const updated = { ...mockSpace, name: 'Backend' }
      vi.mocked(spaceRepository.update).mockResolvedValue(updated)

      const result = await spaceService.update('space-1', { name: 'Backend' })

      expect(spaceRepository.update).toHaveBeenCalledWith('space-1', { name: 'Backend' })
      expect(result).toEqual(updated)
    })
  })

  describe('delete', () => {
    it('deve realizar soft delete do space', async () => {
      vi.mocked(spaceRepository.softDelete).mockResolvedValue(undefined)

      await spaceService.delete('space-1')

      expect(spaceRepository.softDelete).toHaveBeenCalledWith('space-1')
    })
  })
})
