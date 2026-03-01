'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { spaceIconMap, spaceIconKeys, getSpaceIcon } from '@/lib/space-icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

type IconPickerProps = {
  currentIcon: string
  onSelectIcon: (iconKey: string) => Promise<void>
  iconClassName?: string
}

export function IconPicker({ currentIcon, onSelectIcon, iconClassName = 'size-4' }: IconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activeIcon, setActiveIcon] = React.useState(currentIcon)
  const CurrentIcon = getSpaceIcon(activeIcon)

  async function handleSelectIcon(iconKey: string) {
    setActiveIcon(iconKey)
    setOpen(false)
    await onSelectIcon(iconKey)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className="shrink-0 rounded-md p-0.5 hover:bg-sidebar-accent transition-colors"
          onClick={(e) => {
            e.stopPropagation()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              setOpen((prev) => !prev)
            }
          }}
        >
          <CurrentIcon className={iconClassName} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-64 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-xs font-medium text-muted-foreground px-1">
          Escolha um ícone
        </p>
        <ScrollArea className="h-60">
          <TooltipProvider delayDuration={300}>
            <div className="grid grid-cols-7 gap-1">
              {spaceIconKeys.map((key) => {
                const Icon = spaceIconMap[key]
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-accent',
                          activeIcon === key && 'bg-accent ring-1 ring-primary'
                        )}
                        onClick={() => handleSelectIcon(key)}
                      >
                        <Icon className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {key}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
