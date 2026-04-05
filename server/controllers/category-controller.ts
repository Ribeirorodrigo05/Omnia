import 'server-only'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { workspaceUsersService } from '@/server/services/workspace-users-service'
import { categoryService } from '@/server/services/category-service'

export const categoryController = {
  async create(data: { name: string; type: string; spaceId: string; folderId?: string | null; startedAt?: Date | null; endsAt?: Date | null }) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(
      session.user.id,
    )

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para criar categorias.' }
    }

    const category = await categoryService.create(data, session.user.id)
    return { code: 201, data: category }
  },

  async updateIcon(categoryId: string, icon: string) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(
      session.user.id,
    )

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para alterar categorias.' }
    }

    const category = await categoryService.updateIcon(categoryId, icon)

    if (!category) {
      return { code: 404, error: 'Categoria não encontrada.' }
    }

    return { code: 200, data: category }
  },

  async update(categoryId: string, data: { name?: string; startedAt?: Date | null; endsAt?: Date | null }) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(session.user.id)

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para alterar categorias.' }
    }

    const category = await categoryService.update(categoryId, data)

    if (!category) {
      return { code: 404, error: 'Categoria não encontrada.' }
    }

    return { code: 200, data: category }
  },

  async delete(categoryId: string) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return { code: 401, error: 'Não autenticado.' }
    }

    const hasPermission = await workspaceUsersService.hasWritePermission(session.user.id)

    if (!hasPermission) {
      return { code: 403, error: 'Você não tem permissão para deletar categorias.' }
    }

    await categoryService.delete(categoryId)
    return { code: 200 }
  },
}
