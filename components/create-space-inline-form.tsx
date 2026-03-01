'use client'

import * as React from 'react'
import { X, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSpaceAction } from '@/server/actions/space-actions'

type CreateSpaceInlineFormProps = {
  workspaceId: string
  onSuccess: () => void
  onCancel: () => void
}

export function CreateSpaceInlineForm({
  workspaceId,
  onSuccess,
  onCancel,
}: CreateSpaceInlineFormProps) {
  const [spaceName, setSpaceName] = React.useState('')
  const [touched, setTouched] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState('')

  const isValid = spaceName.trim().length >= 4
  const showValidationError = touched && spaceName.trim().length > 0 && !isValid

  async function handleConfirm() {
    if (!isValid || isPending) return

    setIsPending(true)
    setError('')

    const result = await createSpaceAction({
      name: spaceName.trim(),
      workspaceId,
    })

    setIsPending(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    onSuccess()
  }

  return (
    <div className="flex flex-col gap-2 px-2 py-1.5">
      <div className="flex flex-col gap-1">
        <Input
          value={spaceName}
          onChange={(e) => {
            setSpaceName(e.target.value)
            if (!touched) setTouched(true)
            if (error) setError('')
          }}
          placeholder="Nome do espaço"
          autoFocus
          disabled={isPending}
          className={cn(
            (showValidationError || error) &&
              'border-destructive focus-visible:ring-destructive'
          )}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel()
            if (e.key === 'Enter') handleConfirm()
          }}
        />
        {showValidationError && (
          <span className="text-[11px] text-destructive px-1">
            Mínimo de 4 caracteres
          </span>
        )}
        {error && (
          <span className="text-[11px] text-destructive px-1">{error}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          className={cn(
            'flex-1',
            isValid && 'bg-success text-success-foreground hover:bg-success/90'
          )}
          disabled={!isValid || isPending}
          onClick={handleConfirm}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Confirmar'}
        </Button>
        <Button
          size="icon"
          className="size-8 shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          disabled={isPending}
          onClick={onCancel}
        >
          <X className="size-4" color="#FFF" />
        </Button>
      </div>
    </div>
  )
}
