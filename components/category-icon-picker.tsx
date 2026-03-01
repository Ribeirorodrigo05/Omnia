'use client'

import { IconPicker } from '@/components/icon-picker'
import { updateCategoryIconAction } from '@/server/actions/category-actions'

type CategoryIconPickerProps = {
  categoryId: string
  currentIcon: string
}

export function CategoryIconPicker({ categoryId, currentIcon }: CategoryIconPickerProps) {
  async function handleSelectIcon(iconKey: string) {
    await updateCategoryIconAction({ categoryId, icon: iconKey })
  }

  return (
    <IconPicker
      currentIcon={currentIcon}
      onSelectIcon={handleSelectIcon}
      iconClassName="size-3.5"
    />
  )
}
