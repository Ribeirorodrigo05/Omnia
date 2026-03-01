'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Plus,
  Search,
  LayoutDashboard,
  ListTodo,
  Calendar,
  Users,
  Settings,
  LogOut,
  Bell,
  ChevronsUpDown,
  MoreHorizontal,
  Pencil,
  Shield,
  Trash2,
  FolderPlus,
  List,
  Rocket,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { signOut } from '@/lib/auth-client'
import { CreateSpaceInlineForm } from '@/components/create-space-inline-form'
import { RenameSpaceDialog } from '@/components/rename-space-dialog'
import { DeleteSpaceDialog } from '@/components/delete-space-dialog'
import { CreateCategoryDialog } from '@/components/create-category-dialog'
import { SpaceIconPicker } from '@/components/space-icon-picker'
import { CategoryIconPicker } from '@/components/category-icon-picker'
import type { Space, Category } from '@/server/types'
import type { CategoryType } from '@/validators'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const quickLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Minhas Tarefas', icon: ListTodo, badge: '12' },
  { name: 'Calendário', icon: Calendar },
  { name: 'Membros', icon: Users },
]

type SpaceMenuAction = 'rename' | 'create' | 'permission' | 'delete'

type SpaceMenuItem =
  | { type: 'item'; label: string; icon: LucideIcon; action: SpaceMenuAction; destructive?: boolean }
  | { type: 'submenu'; label: string; icon: LucideIcon }
  | { type: 'separator' }

const createSubMenuItems: { label: string; icon: typeof FolderPlus; categoryType: CategoryType }[] = [
  { label: 'Pasta', icon: FolderPlus, categoryType: 'folder' },
  { label: 'Lista', icon: List, categoryType: 'list' },
  { label: 'Iniciativa', icon: Rocket, categoryType: 'initiative' },
]

const spaceMenuItems: SpaceMenuItem[] = [
  { type: 'item', label: 'Renomear', icon: Pencil, action: 'rename' },
  { type: 'submenu', label: 'Criar', icon: Plus },
  { type: 'item', label: 'Permissão', icon: Shield, action: 'permission' },
  { type: 'separator' },
  { type: 'item', label: 'Deletar', icon: Trash2, action: 'delete', destructive: true },
]

type AppSidebarProps = {
  spaces: Space[]
  categoriesBySpace: Record<string, Category[]>
  canCreateSpace: boolean
  workspaceId: string
}

export function AppSidebar({ spaces, categoriesBySpace, canCreateSpace, workspaceId }: AppSidebarProps) {
  const router = useRouter()
  const [openSpaces, setOpenSpaces] = React.useState<Record<string, boolean>>({})
  const [isCreating, setIsCreating] = React.useState(false)
  const [renameTarget, setRenameTarget] = React.useState<Space | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Space | null>(null)
  const [createCategoryTarget, setCreateCategoryTarget] = React.useState<{ space: Space; type: CategoryType } | null>(null)

  function handleSpaceMenuAction(action: SpaceMenuAction, space: Space) {
    const actions: Record<SpaceMenuAction, () => void> = {
      rename: () => setRenameTarget(space),
      create: () => {},
      permission: () => {},
      delete: () => setDeleteTarget(space),
    }
    actions[action]()
  }

  const toggleSpace = (name: string) => {
    setOpenSpaces((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  function handleCreateSpace() {
    setIsCreating(false)
  }

  async function handleSignOut() {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    O
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Omnia</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Pro Plan
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Organizações
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <div className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground font-semibold text-xs">
                    O
                  </div>
                  <span>Omnia</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="size-4" />
                  <span>Nova organização</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 pt-2">
          <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors cursor-pointer">
            <Search className="size-4" />
            <span>Buscar...</span>
            <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              {'⌘K'}
            </kbd>
          </button>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mt-2" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickLinks.map((link) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton isActive={link.active} tooltip={link.name}>
                    <link.icon className="size-4" />
                    <span>{link.name}</span>
                    {link.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-medium"
                      >
                        {link.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wider text-[11px]">
            Espaços
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {spaces.map((space) => (
                  <Collapsible
                    key={space.id}
                    open={openSpaces[space.id] ?? false}
                    onOpenChange={() => toggleSpace(space.id)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={space.name}>
                          <SpaceIconPicker spaceId={space.id} currentIcon={space.icon} />
                          <span>{space.name}</span>
                          <ChevronRight
                            className={cn(
                              'ml-auto size-4 transition-transform duration-200',
                              openSpaces[space.id] && 'rotate-90'
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal className="size-4" />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="right"
                          align="start"
                          className="w-48"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          {spaceMenuItems.map((item, index) => {
                            if (item.type === 'separator') {
                              return <DropdownMenuSeparator key={`sep-${index}`} />
                            }

                            if (item.type === 'submenu') {
                              return (
                                <DropdownMenuSub key={item.label}>
                                  <DropdownMenuSubTrigger>
                                    <item.icon className="size-4" />
                                    <span>{item.label}</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    {createSubMenuItems.map((subItem) => (
                                      <DropdownMenuItem
                                        key={subItem.label}
                                        onClick={() => {
                                          setCreateCategoryTarget({ space, type: subItem.categoryType })
                                        }}
                                      >
                                        <subItem.icon className="size-4" />
                                        <span>{subItem.label}</span>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              )
                            }

                            return (
                              <DropdownMenuItem
                                key={item.label}
                                className={cn(
                                  item.destructive && 'text-destructive focus:text-destructive'
                                )}
                                onClick={() => handleSpaceMenuAction(item.action, space)}
                              >
                                <item.icon className="size-4" />
                                <span>{item.label}</span>
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {(categoriesBySpace[space.id] ?? []).map((category) => (
                              <SidebarMenuSubItem key={category.id}>
                                <SidebarMenuSubButton>
                                  <CategoryIconPicker
                                    categoryId={category.id}
                                    currentIcon={category.icon}
                                  />
                                  <span>{category.name}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
              ))}
              {canCreateSpace && (
                <SidebarMenuItem>
                  {isCreating ? (
                    <CreateSpaceInlineForm
                      workspaceId={workspaceId}
                      onSuccess={handleCreateSpace}
                      onCancel={() => setIsCreating(false)}
                    />
                  ) : (
                    <SidebarMenuButton
                      tooltip="Criar Espaço"
                      onClick={() => setIsCreating(true)}
                    >
                      <Plus className="size-4" />
                      <span>Criar Espaço</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <RenameSpaceDialog
        open={renameTarget !== null}
        onOpenChange={(open) => { if (!open) setRenameTarget(null) }}
        spaceId={renameTarget?.id ?? ''}
        currentName={renameTarget?.name ?? ''}
      />

      <DeleteSpaceDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        spaceId={deleteTarget?.id ?? ''}
        spaceName={deleteTarget?.name ?? ''}
      />

      <CreateCategoryDialog
        open={createCategoryTarget !== null}
        onOpenChange={(open) => { if (!open) setCreateCategoryTarget(null) }}
        spaceId={createCategoryTarget?.space.id ?? ''}
        spaceName={createCategoryTarget?.space.name ?? ''}
        type={createCategoryTarget?.type ?? 'folder'}
      />

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Usuário</span>
                    <span className="truncate text-xs text-muted-foreground">
                      usuario@omnia.app
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel className="flex items-center gap-2 p-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Usuário</span>
                    <span className="truncate text-xs text-muted-foreground">
                      usuario@omnia.app
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    <span>Preferências</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="size-4" />
                    <span>Notificações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="size-4" />
                    <span>Gerenciar membros</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
