'use server'

import { revalidatePath } from 'next/cache'

import { spaceController } from '@/server/controllers/space-controller'

type ActionResult =
  | { success: true }
  | { success: false; code: number; error: string }

export async function createSpaceAction(data: {
  name: string
  workspaceId: string
}): Promise<ActionResult> {
  const result = await spaceController.create(data)

  if (result.code !== 201) {
    return { success: false, code: result.code, error: result.error! }
  }

  revalidatePath('/(private)', 'layout')
  return { success: true }
}

export async function renameSpaceAction(data: {
  spaceId: string
  name: string
}): Promise<ActionResult> {
  const result = await spaceController.rename(data.spaceId, data.name)

  if (result.code !== 200) {
    return { success: false, code: result.code, error: result.error! }
  }

  revalidatePath('/(private)', 'layout')
  return { success: true }
}

export async function updateSpaceIconAction(data: {
  spaceId: string
  icon: string
}): Promise<ActionResult> {
  const result = await spaceController.updateIcon(data.spaceId, data.icon)

  if (result.code !== 200) {
    return { success: false, code: result.code, error: result.error! }
  }

  revalidatePath('/(private)', 'layout')
  return { success: true }
}

export async function softDeleteSpaceAction(data: {
  spaceId: string
}): Promise<ActionResult> {
  const result = await spaceController.softDelete(data.spaceId)

  if (result.code !== 200) {
    return { success: false, code: result.code, error: result.error! }
  }

  revalidatePath('/(private)', 'layout')
  return { success: true }
}
