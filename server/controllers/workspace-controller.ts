import 'server-only'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { workspaceService } from '@/server/services/workspace-service'

export const workspaceController = {
  async create(data: unknown) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return workspaceService.create(data, session.user.id)
  },
}
