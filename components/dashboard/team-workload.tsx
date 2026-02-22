'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

const members = [
  { name: 'Ana Lima', initials: 'AL', tasks: 8, capacity: 10, completed: 6 },
  { name: 'Carlos Souza', initials: 'CS', tasks: 6, capacity: 8, completed: 3 },
  { name: 'Marina Costa', initials: 'MC', tasks: 9, capacity: 10, completed: 7 },
  { name: 'Pedro Alves', initials: 'PA', tasks: 5, capacity: 8, completed: 2 },
  { name: 'Julia Ferreira', initials: 'JF', tasks: 7, capacity: 8, completed: 5 },
]

export function TeamWorkload() {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            Carga do Time
          </CardTitle>
          <span className="text-xs text-muted-foreground font-medium">
            {members.length} membros
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const utilization = Math.round((member.tasks / member.capacity) * 100)
            const completionRate = Math.round((member.completed / member.tasks) * 100)

            return (
              <div key={member.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {member.completed}/{member.tasks} feitas
                        </span>
                        <span className="text-xs font-mono font-medium text-foreground">
                          {utilization}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-10">
                  <Progress
                    value={completionRate}
                    className={`h-1.5 ${
                      utilization > 90
                        ? '[&>[data-slot=progress-indicator]]:bg-destructive'
                        : utilization > 70
                          ? '[&>[data-slot=progress-indicator]]:bg-warning'
                          : '[&>[data-slot=progress-indicator]]:bg-primary'
                    }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
