import { describe, it, expect, vi, beforeEach } from 'vitest'

import { spaceUsersService } from './space-users-service'
import { spaceUsersRepository } from '../repositories/space-users-repository'
import type { SpaceUser } from '@/server/types'

vi.mock('server-only', () => ({}))
vi.mock('../repositories/space-users-repository')

const mockSpaceUser: SpaceUser = {
  spaceId: 'space-1',
  userId: 'user-1',
  role: 'member',
  authorization: ['read_only'],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

describe('spaceUsersService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getBySpaceId', () => {
    it('deve retornar os membros de um space', async () => {
      vi.mocked(spaceUsersRepository.findBySpaceId).mockResolvedValue([mockSpaceUser])

      const result = await spaceUsersService.getBySpaceId('space-1')

      expect(result).toEqual([mockSpaceUser])
      expect(spaceUsersRepository.findBySpaceId).toHaveBeenCalledWith('space-1')
    })
  })

  describe('addMember', () => {
    it('deve adicionar um membro ao space com dados válidos', async () => {
      vi.mocked(spaceUsersRepository.create).mockResolvedValue(mockSpaceUser)

      const result = await spaceUsersService.addMember({
        spaceId: 'space-1',
        userId: 'user-1',
        role: 'member',
        authorization: ['read_only'],
      })

      expect(spaceUsersRepository.create).toHaveBeenCalledWith({
        spaceId: 'space-1',
        userId: 'user-1',
        role: 'member',
        authorization: ['read_only'],
      })
      expect(result).toEqual(mockSpaceUser)
    })

    it('deve lançar erro com role inválido', async () => {
      await expect(
        spaceUsersService.addMember({
          spaceId: 'space-1',
          userId: 'user-1',
          role: 'superuser',
          authorization: ['read_only'],
        })
      ).rejects.toThrow()
    })

    it('deve lançar erro sem spaceId', async () => {
      await expect(
        spaceUsersService.addMember({
          userId: 'user-1',
          role: 'member',
          authorization: ['read_only'],
        })
      ).rejects.toThrow()
    })
  })

  describe('removeMember', () => {
    it('deve remover um membro do space via soft delete', async () => {
      vi.mocked(spaceUsersRepository.softDelete).mockResolvedValue(undefined)

      await spaceUsersService.removeMember('space-1', 'user-1')

      expect(spaceUsersRepository.softDelete).toHaveBeenCalledWith('space-1', 'user-1')
    })
  })
})
