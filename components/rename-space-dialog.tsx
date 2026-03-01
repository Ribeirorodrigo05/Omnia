'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { renameSpaceSchema } from '@/validators'
import { renameSpaceAction } from '@/server/actions/space-actions'
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

type RenameSpaceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  currentName: string
}

export function RenameSpaceDialog({
  open,
  onOpenChange,
  spaceId,
  currentName,
}: RenameSpaceDialogProps) {
  const [name, setName] = React.useState(currentName)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState('')

  const parsed = renameSpaceSchema.safeParse({ name: name.trim() })
  const isValid = parsed.success
  const hasChanged = name.trim() !== currentName

  React.useEffect(() => {
    if (open) {
      setName(currentName)
      setError('')
    }
  }, [open, currentName])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || !hasChanged || isPending) return

    setIsPending(true)
    setError('')

    const result = await renameSpaceAction({
      spaceId,
      name: name.trim(),
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
          <DialogTitle>Dê uma nova identidade ao seu espaço</DialogTitle>
          <DialogDescription>
            O nome do espaço aparece na sidebar e ajuda seu time a se orientar.
            Escolha algo que represente bem o propósito deste espaço.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              placeholder="Nome do espaço"
              autoFocus
              disabled={isPending}
              className={cn(
                !isValid && name.trim().length > 0 &&
                  'border-destructive focus-visible:ring-destructive'
              )}
            />
            {!parsed.success && name.trim().length > 0 && (
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
              disabled={!isValid || !hasChanged || isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Renomear'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
