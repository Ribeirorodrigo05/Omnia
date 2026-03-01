import 'server-only'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { workspaceUsersService } from '@/server/services/workspace-users-service'
import { spaceService } from '@/server/services/space-service'

export const spaceController = {
  async create(data: { name: string; workspaceId: string }) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(
      session.user.id,
    )

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para criar espaços.' }
    }

    const space = await spaceService.create(data, session.user.id)
    return { code: 201, data: space }
  },

  async rename(spaceId: string, name: string) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(
      session.user.id,
    )

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para renomear espaços.' }
    }

    const space = await spaceService.update(spaceId, { name })

    if (!space) {
      return { code: 404, error: 'Espaço não encontrado.' }
    }

    return { code: 200, data: space }
  },

  async updateIcon(spaceId: string, icon: string) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(
      session.user.id,
    )

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para alterar espaços.' }
    }

    const space = await spaceService.update(spaceId, { icon })

    if (!space) {
      return { code: 404, error: 'Espaço não encontrado.' }
    }

    return { code: 200, data: space }
  },

  async softDelete(spaceId: string) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(
      session.user.id,
    )

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para deletar espaços.' }
    }

    await spaceService.delete(spaceId)

    return { code: 200 }
  },
}
