'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, AlertTriangle } from 'lucide-react'

const deadlines = [
  {
    task: 'Lançamento do módulo de relatórios',
    date: '25 Fev',
    daysLeft: 3,
    priority: 'high' as const,
    assignees: [{ initials: 'AL' }, { initials: 'CS' }],
  },
  {
    task: 'Integração com Slack API',
    date: '28 Fev',
    daysLeft: 6,
    priority: 'medium' as const,
    assignees: [{ initials: 'MC' }],
  },
  {
    task: 'Testes E2E da autenticação',
    date: '01 Mar',
    daysLeft: 7,
    priority: 'medium' as const,
    assignees: [{ initials: 'PA' }, { initials: 'JF' }],
  },
  {
    task: 'Deploy v2.4 para produção',
    date: '03 Mar',
    daysLeft: 9,
    priority: 'high' as const,
    assignees: [{ initials: 'RS' }, { initials: 'AL' }, { initials: 'CS' }],
  },
]

const priorityStyles: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-0',
  medium: 'bg-warning/15 text-warning-foreground border-0',
  low: 'bg-muted text-muted-foreground border-0',
}

const priorityLabels: Record<string, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
}

export function UpcomingDeadlines() {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            Próximos Prazos
          </CardTitle>
          <Calendar className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {deadlines.map((deadline, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col items-center gap-0.5 pt-0.5 min-w-12">
                <span className="text-xs font-semibold text-foreground">
                  {deadline.date}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    deadline.daysLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {deadline.daysLeft <= 3 && (
                    <AlertTriangle className="inline size-2.5 mr-0.5 -mt-0.5" />
                  )}
                  {deadline.daysLeft}d
                </span>
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-sm font-medium text-foreground leading-snug truncate">
                  {deadline.task}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {deadline.assignees.map((assignee, i) => (
                      <Avatar key={i} className="size-5 border-2 border-card">
                        <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-semibold">
                          {assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 h-4 font-medium ${priorityStyles[deadline.priority]}`}
                  >
                    {priorityLabels[deadline.priority]}
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
