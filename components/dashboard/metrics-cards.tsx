'use client'

import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const metrics = [
  {
    label: 'Tarefas Concluídas',
    value: '128',
    change: '+12%',
    trend: 'up' as const,
    icon: CheckCircle2,
    description: 'vs. semana anterior',
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'Em Progresso',
    value: '34',
    change: '+3',
    trend: 'up' as const,
    icon: Clock,
    description: 'tarefas ativas agora',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Atrasadas',
    value: '7',
    change: '-2',
    trend: 'down' as const,
    icon: AlertTriangle,
    description: 'vs. semana anterior',
    iconColor: 'text-warning-foreground',
    iconBg: 'bg-warning/20',
  },
  {
    label: 'Velocidade da Sprint',
    value: '42',
    change: '+8%',
    trend: 'up' as const,
    icon: TrendingUp,
    description: 'pontos por sprint',
    iconColor: 'text-chart-5',
    iconBg: 'bg-chart-5/10',
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="border border-border/60 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground tracking-tight">
                    {metric.value}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                      metric.trend === 'up' && metric.label !== 'Atrasadas'
                        ? 'text-success'
                        : metric.label === 'Atrasadas'
                          ? 'text-success'
                          : 'text-destructive'
                    }`}
                  >
                    {metric.trend === 'up' && metric.label !== 'Atrasadas' ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {metric.change}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {metric.description}
                </span>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${metric.iconBg}`}
              >
                <metric.icon className={`size-5 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
