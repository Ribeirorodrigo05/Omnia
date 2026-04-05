'use client'

import * as React from 'react'
import { Trash2, Loader2 } from 'lucide-react'

import { deleteCategoryAction } from '@/server/actions/category-actions'
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

type DeleteCategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  categoryName: string
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
}: DeleteCategoryDialogProps) {
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
    await deleteCategoryAction(categoryId)
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
                Essa ação vai remover <strong className="text-foreground">{categoryName}</strong> da pasta.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            O item e todo o seu conteúdo serão movidos para a <strong className="text-foreground">lixeira</strong>,
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
            disabled={isPending}
          />
          <span className="text-sm text-muted-foreground">
            Entendo que essa ação moverá o item para a lixeira
          </span>
        </label>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!confirmed || isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Mover para lixeira'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
