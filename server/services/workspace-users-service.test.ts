import { describe, it, expect, vi, beforeEach } from 'vitest'

import { workspaceUsersService } from './workspace-users-service'
import { workspaceUsersRepository } from '../repositories/workspace-users-repository'
import type { WorkspaceUser } from '@/server/types'

vi.mock('server-only', () => ({}))
vi.mock('../repositories/workspace-users-repository')

const mockMembership: WorkspaceUser = {
  workspaceId: 'ws-1',
  userId: 'user-1',
  role: 'owner',
  authorization: ['read_only', 'write', 'delete'],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('workspaceUsersService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hasWorkspace', () => {
    it('deve retornar true quando o usuário possui workspaces', async () => {
      vi.mocked(workspaceUsersRepository.findByUserId).mockResolvedValue([
        { workspaceId: 'ws-1', userId: 'user-1' },
      ])

      const result = await workspaceUsersService.hasWorkspace('user-1')

      expect(result).toBe(true)
      expect(workspaceUsersRepository.findByUserId).toHaveBeenCalledWith('user-1')
      expect(workspaceUsersRepository.findByUserId).toHaveBeenCalledOnce()
    })

    it('deve retornar false quando o usuário não possui workspaces', async () => {
      vi.mocked(workspaceUsersRepository.findByUserId).mockResolvedValue([])

      const result = await workspaceUsersService.hasWorkspace('user-1')

      expect(result).toBe(false)
    })

    it('deve retornar true quando o usuário possui múltiplos workspaces', async () => {
      vi.mocked(workspaceUsersRepository.findByUserId).mockResolvedValue([
        { workspaceId: 'ws-1', userId: 'user-1' },
        { workspaceId: 'ws-2', userId: 'user-1' },
      ])

      const result = await workspaceUsersService.hasWorkspace('user-1')

      expect(result).toBe(true)
    })
  })

  describe('getMembership', () => {
    it('deve retornar a primeira membership do usuário', async () => {
      vi.mocked(workspaceUsersRepository.findFullByUserId).mockResolvedValue([mockMembership])

      const result = await workspaceUsersService.getMembership('user-1')

      expect(result).toEqual(mockMembership)
      expect(workspaceUsersRepository.findFullByUserId).toHaveBeenCalledWith('user-1')
    })

    it('deve retornar undefined quando o usuário não possui membership', async () => {
      vi.mocked(workspaceUsersRepository.findFullByUserId).mockResolvedValue([])

      const result = await workspaceUsersService.getMembership('user-1')

      expect(result).toBeUndefined()
    })
  })

  describe('hasWritePermission', () => {
    it('deve retornar true quando o usuário possui permissão write', async () => {
      vi.mocked(workspaceUsersRepository.findFullByUserId).mockResolvedValue([mockMembership])

      const result = await workspaceUsersService.hasWritePermission('user-1')

      expect(result).toBe(true)
    })

    it('deve retornar false quando o usuário possui apenas read_only', async () => {
      vi.mocked(workspaceUsersRepository.findFullByUserId).mockResolvedValue([
        { ...mockMembership, authorization: ['read_only'] },
      ])

      const result = await workspaceUsersService.hasWritePermission('user-1')

      expect(result).toBe(false)
    })

    it('deve retornar false quando o usuário não possui membership', async () => {
      vi.mocked(workspaceUsersRepository.findFullByUserId).mockResolvedValue([])

      const result = await workspaceUsersService.hasWritePermission('user-1')

      expect(result).toBe(false)
    })
  })
})
