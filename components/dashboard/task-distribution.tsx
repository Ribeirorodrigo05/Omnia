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
  Cell,
} from 'recharts'

const statusData = [
  { name: 'Backlog', value: 18, fill: 'oklch(0.80 0.04 250)' },
  { name: 'A fazer', value: 12, fill: 'oklch(0.70 0.10 250)' },
  { name: 'Fazendo', value: 8, fill: 'oklch(0.55 0.18 250)' },
  { name: 'Revisão', value: 5, fill: 'oklch(0.75 0.12 80)' },
  { name: 'Pronto', value: 22, fill: 'oklch(0.65 0.15 165)' },
]

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: { name: string; fill: string } }>
}) {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.payload.name}</p>
        <p className="text-xs text-muted-foreground">{data.value} tarefas</p>
      </div>
    )
  }
  return null
}

export function TaskDistribution() {
  const total = statusData.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            Distribuição de Tarefas
          </CardTitle>
          <span className="text-sm text-muted-foreground font-medium">
            {total} total
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.91 0.008 250)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
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
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {statusData.map((status) => (
            <div key={status.name} className="flex items-center gap-1.5">
              <div
                className="size-2.5 rounded-full"
                style={{ backgroundColor: status.fill }}
              />
              <span className="text-xs text-muted-foreground">{status.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
