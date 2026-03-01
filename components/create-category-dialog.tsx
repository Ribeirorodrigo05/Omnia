'use client'

import * as React from 'react'
import { FolderPlus, List, Rocket, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { createCategorySchema } from '@/validators'
import type { CategoryType } from '@/validators'
import { createCategoryAction } from '@/server/actions/category-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const categoryConfig: Record<CategoryType, {
  icon: typeof FolderPlus
  title: (spaceName: string) => string
  description: string
  placeholder: string
  submitLabel: string
}> = {
  folder: {
    icon: FolderPlus,
    title: (spaceName) => `Nova pasta em ${spaceName}`,
    description: 'Pastas ajudam a organizar seu espaço — agrupe por sprints, meses, categorias ou do jeito que fizer mais sentido para o seu time.',
    placeholder: 'Ex: Sprint 01, Janeiro, Documentação...',
    submitLabel: 'Criar pasta',
  },
  list: {
    icon: List,
    title: (spaceName) => `Nova lista em ${spaceName}`,
    description: 'Listas são perfeitas para acompanhar tarefas, itens de backlog ou qualquer conjunto de atividades do seu time.',
    placeholder: 'Ex: Backlog, Tarefas Q1, Bugs...',
    submitLabel: 'Criar lista',
  },
  initiative: {
    icon: Rocket,
    title: (spaceName) => `Nova iniciativa em ${spaceName}`,
    description: 'Iniciativas representam objetivos maiores com prazo — ideais para metas trimestrais, projetos estratégicos ou OKRs.',
    placeholder: 'Ex: Lançamento v2, Meta Q1, Redesign...',
    submitLabel: 'Criar iniciativa',
  },
}

type CreateCategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  spaceName: string
  type: CategoryType
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  type,
}: CreateCategoryDialogProps) {
  const [name, setName] = React.useState('')
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState('')

  const config = categoryConfig[type]
  const Icon = config.icon
  const parsed = createCategorySchema.safeParse({ name: name.trim(), type })
  const isValid = parsed.success
  const hasValue = name.trim().length > 0

  React.useEffect(() => {
    if (open) {
      setName('')
      setError('')
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || isPending) return

    setIsPending(true)
    setError('')

    const result = await createCategoryAction({
      spaceId,
      name: name.trim(),
      type,
    })

    setIsPending(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle>{config.title(spaceName)}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              placeholder={config.placeholder}
              autoFocus
              disabled={isPending}
              className={cn(
                !isValid && hasValue &&
                  'border-destructive focus-visible:ring-destructive'
              )}
            />
            {!parsed.success && hasValue && (
              <span className="text-[11px] text-destructive px-1">
                {parsed.error.issues[0].message}
              </span>
            )}
            {error && (
              <span className="text-[11px] text-destructive px-1">{error}</span>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-success text-success-foreground hover:bg-success/90"
              disabled={!isValid || isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                config.submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
