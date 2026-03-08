import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { layoutGuard } from './layout-guard'
import { workspaceUsersService } from '@/server/services/workspace-users-service'
import { workspaceService } from '@/server/services/workspace-service'
import { spaceService } from '@/server/services/space-service'
import { categoryService } from '@/server/services/category-service'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Suspense } from 'react'

async function getWorkspace(workspaceId?: string) {
  if (!workspaceId) return undefined
  return workspaceService.getById(workspaceId)
}

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await layoutGuard()

  const pathname = (await headers()).get('x-pathname') ?? ''

  if (pathname !== '/workspace/create') {
    const hasWorkspace = await workspaceUsersService.hasWorkspace(session.user.id)

    if (!hasWorkspace) {
      redirect('/workspace/create')
    }
  }

  const [spaces, canCreateSpace, membership] = await Promise.all([
    spaceService.getByUserId(session.user.id),
    workspaceUsersService.hasWritePermission(session.user.id),
    workspaceUsersService.getMembership(session.user.id),
  ])

  const [categoriesBySpace, workspace] = await Promise.all([
    categoryService.getBySpaceIds(spaces.map((s) => s.id)),
    getWorkspace(membership?.workspaceId),
  ])

  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading sidebar...</div>}>
      <AppSidebar
        spaces={spaces}
        categoriesBySpace={categoriesBySpace}
        canCreateSpace={canCreateSpace}
        workspaceId={membership?.workspaceId ?? ''}
        workspaceName={workspace?.name ?? ''}
        userName={session.user.name}
        userEmail={session.user.email}
      />
      </Suspense>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}