'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const burndownData = [
  { day: 'D1', ideal: 42, actual: 42 },
  { day: 'D2', ideal: 39, actual: 40 },
  { day: 'D3', ideal: 36, actual: 38 },
  { day: 'D4', ideal: 33, actual: 35 },
  { day: 'D5', ideal: 30, actual: 32 },
  { day: 'D6', ideal: 27, actual: 28 },
  { day: 'D7', ideal: 24, actual: 26 },
  { day: 'D8', ideal: 21, actual: 22 },
  { day: 'D9', ideal: 18, actual: 20 },
  { day: 'D10', ideal: 15, actual: 16 },
]

const sprintGoals = [
  { name: 'Refatorar módulo de auth', progress: 85, status: 'on-track' },
  { name: 'Implementar notificações', progress: 60, status: 'at-risk' },
  { name: 'Redesign da dashboard', progress: 100, status: 'done' },
  { name: 'API de relatórios v2', progress: 40, status: 'at-risk' },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-muted-foreground">
            <span
              className="inline-block size-2 rounded-full mr-1.5"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name === 'ideal' ? 'Ideal' : 'Real'}: {entry.value} pts
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SprintProgress() {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Sprint 24
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 text-xs"
            >
              Em andamento
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">Dia 10 de 14</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={burndownData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.18 250)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="oklch(0.55 0.18 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.91 0.008 250)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'oklch(0.50 0.02 260)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'oklch(0.50 0.02 260)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="ideal"
                stroke="oklch(0.80 0.04 250)"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                fill="none"
                name="ideal"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="oklch(0.55 0.18 250)"
                strokeWidth={2}
                fill="url(#colorActual)"
                name="actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Objetivos da Sprint
          </h4>
          <div className="space-y-3">
            {sprintGoals.map((goal) => (
              <div key={goal.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{goal.name}</span>
                  <span className="text-xs font-mono text-muted-foreground font-medium">
                    {goal.progress}%
                  </span>
                </div>
                <Progress
                  value={goal.progress}
                  className={`h-1.5 ${
                    goal.status === 'done'
                      ? '[&>[data-slot=progress-indicator]]:bg-success'
                      : goal.status === 'at-risk'
                        ? '[&>[data-slot=progress-indicator]]:bg-warning'
                        : '[&>[data-slot=progress-indicator]]:bg-primary'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
