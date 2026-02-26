import { describe, it, expect, vi, beforeEach } from 'vitest'

import { workspaceService } from './workspace-service'
import { workspaceRepository } from '../repositories/workspace-repository'
import { workspaceUsersRepository } from '../repositories/workspace-users-repository'
import type { Workspace, WorkspaceUser } from '@/server/types'

vi.mock('server-only', () => ({}))
vi.mock('../repositories/workspace-repository')
vi.mock('../repositories/workspace-users-repository')

const mockWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Acme Corp',
  ownerId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockMembership: WorkspaceUser = {
  workspaceId: 'ws-1',
  userId: 'user-1',
  role: 'owner',
  authorization: ['read_only', 'write', 'delete'],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('workspaceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('deve criar um workspace e vincular o dono como owner', async () => {
      vi.mocked(workspaceRepository.create).mockResolvedValue(mockWorkspace)
      vi.mocked(workspaceUsersRepository.create).mockResolvedValue(mockMembership)

      const result = await workspaceService.create({ name: 'Acme Corp' }, 'user-1')

      expect(workspaceRepository.create).toHaveBeenCalledWith({
        name: 'Acme Corp',
        ownerId: 'user-1',
      })
      expect(workspaceUsersRepository.create).toHaveBeenCalledWith({
        workspaceId: 'ws-1',
        userId: 'user-1',
        role: 'owner',
        authorization: ['read_only', 'write', 'delete'],
      })
      expect(result).toEqual(mockWorkspace)
    })

    it('deve lançar erro com nome inválido (números)', async () => {
      await expect(
        workspaceService.create({ name: 'Acme123' }, 'user-1'),
      ).rejects.toThrow()
    })

    it('deve lançar erro com nome vazio', async () => {
      await expect(
        workspaceService.create({ name: '' }, 'user-1'),
      ).rejects.toThrow()
    })

    it('deve lançar erro com caracteres especiais', async () => {
      await expect(
        workspaceService.create({ name: 'Acme@Corp' }, 'user-1'),
      ).rejects.toThrow()
    })

    it('deve aceitar nomes com acentuação', async () => {
      vi.mocked(workspaceRepository.create).mockResolvedValue({
        ...mockWorkspace,
        name: 'Empresa Açaí',
      })
      vi.mocked(workspaceUsersRepository.create).mockResolvedValue(mockMembership)

      const result = await workspaceService.create({ name: 'Empresa Açaí' }, 'user-1')

      expect(result.name).toBe('Empresa Açaí')
    })
  })
})
