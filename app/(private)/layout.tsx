import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { verifySession } from '@/lib/utils/reusable-functions/auth/verify-session'
import { workspaceUsersService } from '@/server/services/workspace-users-service'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySession()

  const pathname = (await headers()).get('x-pathname') ?? ''

  if (pathname !== '/workspace/create') {
    const hasWorkspace = await workspaceUsersService.hasWorkspace(session.user.id)

    if (!hasWorkspace) {
      redirect('/workspace/create')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}