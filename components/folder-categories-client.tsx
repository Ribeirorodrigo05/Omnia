'use client'

import * as React from 'react'
import Link from 'next/link'
import { List, Rocket, MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react'

import { spaceIconMap } from '@/lib/space-icons'
import { CreateCategoryDialog } from '@/components/create-category-dialog'
import { RenameCategoryDialog } from '@/components/rename-category-dialog'
import { DeleteCategoryDialog } from '@/components/delete-category-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Category } from '@/server/types'
import type { CategoryType } from '@/validators'

const categoryTypeConfig: Record<'list' | 'initiative', {
  icon: typeof List
  label: string
  href: (id: string) => string
}> = {
  list: {
    icon: List,
    label: 'Lista',
    href: (id) => `/list/${id}`,
  },
  initiative: {
    icon: Rocket,
    label: 'Iniciativa',
    href: (id) => `/initiative/${id}`,
  },
}

type CreateTarget = { type: CategoryType } | null
type RenameTarget = { id: string; name: string } | null
type DeleteTarget = { id: string; name: string } | null

type FolderCategoriesClientProps = {
  folder: Category
  categories: Category[]
  spaceName: string
}

export function FolderCategoriesClient({
  folder,
  categories,
  spaceName,
}: FolderCategoriesClientProps) {
  const [createTarget, setCreateTarget] = React.useState<CreateTarget>(null)
  const [renameTarget, setRenameTarget] = React.useState<RenameTarget>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget>(null)

  const lists = categories.filter((c) => c.type === 'list')
  const initiatives = categories.filter((c) => c.type === 'initiative')

  const FolderIcon = spaceIconMap[folder.icon] ?? spaceIconMap['folder-kanban']

  function renderCategoryCard(category: Category) {
    const config = categoryTypeConfig[category.type as 'list' | 'initiative']
    if (!config) return null
    const Icon = config.icon
    const CategoryIcon = spaceIconMap[category.icon] ?? Icon

    return (
      <div
        key={category.id}
        className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <Link
          href={config.href(category.id)}
          className="flex flex-1 items-center gap-3 min-w-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <CategoryIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="truncate text-sm font-medium text-foreground">
              {category.name}
            </span>
            {(category.startedAt ?? category.endsAt) && (
              <span className="text-xs text-muted-foreground">
                {category.startedAt
                  ? new Date(category.startedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                  : ''}
                {category.startedAt && category.endsAt ? ' → ' : ''}
                {category.endsAt
                  ? new Date(category.endsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                  : ''}
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="text-xs">
            {config.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setRenameTarget({ id: category.id, name: category.name })}
                >
                  <Pencil />
                  Renomear
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setDeleteTarget({ id: category.id, name: category.name })}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 />
                  Mover para lixeira
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-foreground">{folder.name}</h1>
              <p className="text-sm text-muted-foreground">
                {spaceName}
                {(folder.startedAt ?? folder.endsAt) && (
                  <span>
                    {' · '}
                    {folder.startedAt
                      ? new Date(folder.startedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                      : ''}
                    {folder.startedAt && folder.endsAt ? ' → ' : ''}
                    {folder.endsAt
                      ? new Date(folder.endsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                      : ''}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus data-icon="inline-start" />
                  Novo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setCreateTarget({ type: 'list' })}>
                    <List />
                    Lista
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCreateTarget({ type: 'initiative' })}>
                    <Rocket />
                    Iniciativa
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <List className="size-7" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Nenhum item nesta pasta</p>
              <p className="text-sm text-muted-foreground">
                Crie uma lista ou iniciativa para organizar o trabalho do time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCreateTarget({ type: 'list' })}>
                <List data-icon="inline-start" />
                Nova lista
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCreateTarget({ type: 'initiative' })}>
                <Rocket data-icon="inline-start" />
                Nova iniciativa
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {lists.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <List className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Listas
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {lists.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCreateTarget({ type: 'list' })}
                  >
                    <Plus data-icon="inline-start" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {lists.map(renderCategoryCard)}
                </div>
              </div>
            )}

            {initiatives.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Iniciativas
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {initiatives.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCreateTarget({ type: 'initiative' })}
                  >
                    <Plus data-icon="inline-start" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {initiatives.map(renderCategoryCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {createTarget && (
        <CreateCategoryDialog
          open={createTarget !== null}
          onOpenChange={(open) => { if (!open) setCreateTarget(null) }}
          spaceId={folder.spaceId}
          spaceName={spaceName}
          type={createTarget.type}
          folderId={folder.id}
        />
      )}

      {renameTarget && (
        <RenameCategoryDialog
          open={renameTarget !== null}
          onOpenChange={(open) => { if (!open) setRenameTarget(null) }}
          categoryId={renameTarget.id}
          currentName={renameTarget.name}
        />
      )}

      {deleteTarget && (
        <DeleteCategoryDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
          categoryId={deleteTarget.id}
          categoryName={deleteTarget.name}
        />
      )}
    </>
  )
}
