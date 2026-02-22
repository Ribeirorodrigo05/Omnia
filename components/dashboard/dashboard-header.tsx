'use client'

import { Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export function DashboardHeader() {
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const dateStr = formatter.format(today)

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border/60 bg-card px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="h-5" />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-foreground leading-tight">
            Dashboard
          </h1>
          <span className="text-xs text-muted-foreground capitalize">
            {dateStr}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 text-muted-foreground hover:text-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
            <span className="sr-only">Notificações</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 shadow-sm"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Nova Tarefa</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
