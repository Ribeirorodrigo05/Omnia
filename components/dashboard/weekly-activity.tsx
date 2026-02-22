'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { day: 'Seg', criadas: 8, concluidas: 6 },
  { day: 'Ter', criadas: 5, concluidas: 9 },
  { day: 'Qua', criadas: 12, concluidas: 8 },
  { day: 'Qui', criadas: 6, concluidas: 11 },
  { day: 'Sex', criadas: 9, concluidas: 14 },
  { day: 'Sáb', criadas: 2, concluidas: 3 },
  { day: 'Dom', criadas: 1, concluidas: 1 },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
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
            {entry.dataKey === 'criadas' ? 'Criadas' : 'Concluídas'}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function WeeklyActivity() {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            Atividade Semanal
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-primary/30" />
              <span className="text-xs text-muted-foreground">Criadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Concluídas</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              barGap={2}
            >
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
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'oklch(0.95 0.005 250)' }}
              />
              <Bar
                dataKey="criadas"
                fill="oklch(0.55 0.18 250 / 0.3)"
                radius={[3, 3, 0, 0]}
                barSize={16}
              />
              <Bar
                dataKey="concluidas"
                fill="oklch(0.55 0.18 250)"
                radius={[3, 3, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
