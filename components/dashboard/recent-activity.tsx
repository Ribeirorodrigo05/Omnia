'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const activities = [
  {
    user: 'Ana Lima',
    initials: 'AL',
    action: 'completou',
    task: 'Implementar SSO login',
    time: 'há 5 min',
    type: 'completed' as const,
  },
  {
    user: 'Carlos Souza',
    initials: 'CS',
    action: 'moveu para revisão',
    task: 'Redesign da sidebar',
    time: 'há 15 min',
    type: 'moved' as const,
  },
  {
    user: 'Marina Costa',
    initials: 'MC',
    action: 'comentou em',
    task: 'Otimizar queries do dashboard',
    time: 'há 32 min',
    type: 'commented' as const,
  },
  {
    user: 'Pedro Alves',
    initials: 'PA',
    action: 'criou',
    task: 'Bug: modal fecha inesperadamente',
    time: 'há 1h',
    type: 'created' as const,
  },
  {
    user: 'Julia Ferreira',
    initials: 'JF',
    action: 'completou',
    task: 'Documentar API de webhooks',
    time: 'há 1h',
    type: 'completed' as const,
  },
  {
    user: 'Rafael Santos',
    initials: 'RS',
    action: 'atribuiu para si',
    task: 'Implementar dark mode',
    time: 'há 2h',
    type: 'assigned' as const,
  },
]

const typeColors: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  moved: 'bg-primary/10 text-primary',
  commented: 'bg-muted text-muted-foreground',
  created: 'bg-chart-3/10 text-chart-3',
  assigned: 'bg-warning/15 text-warning-foreground',
}

const typeLabels: Record<string, string> = {
  completed: 'Feito',
  moved: 'Movido',
  commented: 'Comentário',
  created: 'Novo',
  assigned: 'Atribuído',
}

export function RecentActivity() {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            Atividade Recente
          </CardTitle>
          <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            Ver tudo
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-accent/50 transition-colors"
            >
              <Avatar className="size-7 mt-0.5">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm text-foreground leading-snug">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  <span className="font-medium">{activity.task}</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {activity.time}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 h-4 border-0 font-medium ${typeColors[activity.type]}`}
                  >
                    {typeLabels[activity.type]}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
