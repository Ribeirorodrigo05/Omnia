'use client'

import { IconPicker } from '@/components/icon-picker'
import { updateSpaceIconAction } from '@/server/actions/space-actions'

type SpaceIconPickerProps = {
  spaceId: string
  currentIcon: string
}

export function SpaceIconPicker({ spaceId, currentIcon }: SpaceIconPickerProps) {
  async function handleSelectIcon(iconKey: string) {
    await updateSpaceIconAction({ spaceId, icon: iconKey })
  }

  return (
    <IconPicker
      currentIcon={currentIcon}
      onSelectIcon={handleSelectIcon}
    />
  )
}
