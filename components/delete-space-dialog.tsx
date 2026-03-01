'use client'

import * as React from 'react'
import { Trash2, Loader2 } from 'lucide-react'

import { softDeleteSpaceAction } from '@/server/actions/space-actions'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type DeleteSpaceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceName: string
  spaceId: string
}

export function DeleteSpaceDialog({
  open,
  onOpenChange,
  spaceName,
  spaceId,
}: DeleteSpaceDialogProps) {
  const [confirmed, setConfirmed] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setConfirmed(false)
      setIsPending(false)
    }
  }, [open])

  async function handleDelete() {
    if (!confirmed || isPending) return
    setIsPending(true)
    await softDeleteSpaceAction({ spaceId })
    setIsPending(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="size-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Mover para lixeira</DialogTitle>
              <DialogDescription className="mt-1">
                Essa ação vai remover o espaço <strong className="text-foreground">{spaceName}</strong> do seu workspace.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            O espaço e todos os seus itens serão movidos para a <strong className="text-foreground">lixeira</strong>,
            onde ficarão disponíveis para recuperação por até <strong className="text-foreground">10 dias</strong>.
          </p>
          <p className="mt-2">
            Após esse período, a exclusão permanente acontecerá automaticamente e
            <strong className="text-foreground"> não poderá ser desfeita</strong>.
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none rounded-md border border-border px-4 py-3 transition-colors hover:bg-muted/50">
          <Checkbox
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
            className="border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
          />
          <span className="text-sm font-medium text-destructive">Sim, eu entendi!</span>
        </label>

        <DialogFooter>
          <Button
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            disabled={!confirmed || isPending}
            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer"
            onClick={handleDelete}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? 'Deletando...' : 'Deletar espaço'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
