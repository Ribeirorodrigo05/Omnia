'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Plus,
  Search,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Calendar,
  Target,
  Users,
  Settings,
  LogOut,
  Bell,
  ChevronsUpDown,
  Sparkles,
  CircleDot,
  FileText,
  Clock,
  Hash,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { signOut } from '@/lib/auth-client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const workspaces = [
  {
    name: 'Product Team',
    emoji: 'P',
    color: 'bg-primary',
    spaces: [
      {
        name: 'Sprint Backlog',
        icon: ListTodo,
        items: [
          { name: 'User Stories', icon: FileText },
          { name: 'Bug Fixes', icon: CircleDot },
          { name: 'Tech Debt', icon: Clock },
        ],
      },
      {
        name: 'Roadmap',
        icon: Target,
        items: [
          { name: 'Q1 2026', icon: Hash },
          { name: 'Q2 2026', icon: Hash },
        ],
      },
      {
        name: 'Design System',
        icon: Sparkles,
        items: [
          { name: 'Components', icon: Hash },
          { name: 'Tokens', icon: Hash },
        ],
      },
    ],
  },
  {
    name: 'Marketing',
    emoji: 'M',
    color: 'bg-chart-2',
    spaces: [
      {
        name: 'Campaigns',
        icon: FolderKanban,
        items: [
          { name: 'Social Media', icon: Hash },
          { name: 'Email Flows', icon: Hash },
        ],
      },
      {
        name: 'Content Calendar',
        icon: Calendar,
        items: [
          { name: 'Blog Posts', icon: FileText },
          { name: 'Video Scripts', icon: FileText },
        ],
      },
    ],
  },
  {
    name: 'Engineering',
    emoji: 'E',
    color: 'bg-chart-3',
    spaces: [
      {
        name: 'Infrastructure',
        icon: Settings,
        items: [
          { name: 'CI/CD', icon: Hash },
          { name: 'Monitoring', icon: Hash },
        ],
      },
    ],
  },
]

const quickLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Minhas Tarefas', icon: ListTodo, badge: '12' },
  { name: 'Calendário', icon: Calendar },
  { name: 'Membros', icon: Users },
]

export function AppSidebar() {
  const router = useRouter()
  const [openSpaces, setOpenSpaces] = React.useState<Record<string, boolean>>({
    'Sprint Backlog': true,
  })

  const toggleSpace = (name: string) => {
    setOpenSpaces((prev) => ({ ...prev, [name]: !prev[name] }))
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
          <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors">
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

        {workspaces.map((workspace) => (
          <SidebarGroup key={workspace.name}>
            <SidebarGroupLabel className="uppercase tracking-wider text-[11px]">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex size-4 items-center justify-center rounded text-[9px] font-bold text-primary-foreground',
                    workspace.color
                  )}
                >
                  {workspace.emoji}
                </div>
                <span>{workspace.name}</span>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspace.spaces.map((space) => (
                  <Collapsible
                    key={space.name}
                    open={openSpaces[space.name] ?? false}
                    onOpenChange={() => toggleSpace(space.name)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={space.name}>
                          <space.icon className="size-4" />
                          <span>{space.name}</span>
                          <ChevronRight
                            className={cn(
                              'ml-auto size-4 transition-transform duration-200',
                              openSpaces[space.name] && 'rotate-90'
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {space.items.map((item) => (
                            <SidebarMenuSubItem key={item.name}>
                              <SidebarMenuSubButton>
                                <item.icon className="size-3.5" />
                                <span>{item.name}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

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
