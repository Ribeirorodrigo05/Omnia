'use server'

import { revalidatePath } from 'next/cache'

import { categoryController } from '@/server/controllers/category-controller'

type ActionResult =
  | { success: true }
  | { success: false; code: number; error: string }

export async function createCategoryAction(data: {
  name: string
  type: 'folder' | 'list' | 'initiative'
  spaceId: string
  startedAt?: Date | null
  endsAt?: Date | null
}): Promise<ActionResult> {
  const result = await categoryController.create(data)

  if (result.code !== 201) {
    return { success: false, code: result.code, error: result.error! }
  }

  revalidatePath('/(private)', 'layout')
  return { success: true }
}

export async function updateCategoryIconAction(data: {
  categoryId: string
  icon: string
}): Promise<ActionResult> {
  const result = await categoryController.updateIcon(data.categoryId, data.icon)

  if (result.code !== 200) {
    return { success: false, code: result.code, error: result.error! }
  }

  revalidatePath('/(private)', 'layout')
  return { success: true }
}
