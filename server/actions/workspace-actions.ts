'use server'

import { redirect } from 'next/navigation'

import { workspaceController } from '@/server/controllers/workspace-controller'
import type { CreateWorkspaceFormData } from '@/validators'

export async function createWorkspaceAction(
  data: CreateWorkspaceFormData,
): Promise<{ error: string } | undefined> {
  try {
    await workspaceController.create(data)
  } catch {
    return { error: 'Erro ao criar workspace. Tente novamente.' }
  }

  redirect('/home')
}
