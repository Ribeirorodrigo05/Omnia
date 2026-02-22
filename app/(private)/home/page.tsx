import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { SprintProgress } from '@/components/dashboard/sprint-progress'
import { TaskDistribution } from '@/components/dashboard/task-distribution'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { TeamWorkload } from '@/components/dashboard/team-workload'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import { WeeklyActivity } from '@/components/dashboard/weekly-activity'

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight text-balance">
                Bem-vindo de volta
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Aqui está um resumo do progresso da sua equipe.
              </p>
            </div>

            <MetricsCards />

            <div className="grid gap-6 lg:grid-cols-2">
              <SprintProgress />
              <TaskDistribution />
            </div>

            <WeeklyActivity />

            <div className="grid gap-6 lg:grid-cols-3">
              <RecentActivity />
              <TeamWorkload />
              <UpcomingDeadlines />
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
