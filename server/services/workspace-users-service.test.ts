import { describe, it, expect, vi, beforeEach } from 'vitest'

import { workspaceUsersService } from './workspace-users-service'
import { workspaceUsersRepository } from '../repositories/workspace-users-repository'

vi.mock('server-only', () => ({}))
vi.mock('../repositories/workspace-users-repository')

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
})
