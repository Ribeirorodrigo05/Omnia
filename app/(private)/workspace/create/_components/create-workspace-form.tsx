'use client'

import { ArrowRight, Building2, Check, Info, Layers, LayoutList, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createWorkspaceAction } from '@/server/actions/workspace-actions'
import { createWorkspaceSchema, type CreateWorkspaceFormData } from '@/validators'

const WORKSPACE_NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/

export function CreateWorkspaceForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: 'onChange',
    defaultValues: { name: '' },
  })

  const name = watch('name')
  const hasValue = name.length > 0
  const hasOnlyLetters = hasValue && WORKSPACE_NAME_REGEX.test(name)

  const validationRules = [
    {
      label: 'Apenas letras e espaços são permitidos',
      valid: hasOnlyLetters,
      invalid: hasValue && !hasOnlyLetters,
    },
    {
      label: 'Caracteres especiais e números não são permitidos',
      valid: hasOnlyLetters,
      invalid: hasValue && !hasOnlyLetters,
    },
    {
      label: 'Pode ser alterado depois em Perfil / Workspace',
      valid: false,
      invalid: false,
      neutral: true,
    },
  ]

  async function onSubmit(data: CreateWorkspaceFormData) {
    const result = await createWorkspaceAction(data)
    if (result?.error) {
      setError('root', { message: result.error })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8" noValidate>
      <div className="space-y-3">
        <Label htmlFor="workspace-name" className="text-sm font-medium text-foreground">
          Nome do workspace
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Building2 className="size-4 text-muted-foreground" />
          </div>
          <Input
            id="workspace-name"
            type="text"
            placeholder="Ex: Minha Empresa"
            className={cn(
              'h-12 pl-10 pr-10 text-base bg-background',
              errors.name &&
                'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
              isValid &&
                'border-primary/40 focus-visible:border-primary focus-visible:ring-primary/20',
            )}
            aria-invalid={!!errors.name}
            aria-describedby="workspace-rules"
            autoFocus
            autoComplete="off"
            {...register('name')}
          />
          {hasValue && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              {isValid ? (
                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3 text-primary" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => reset({ name: '' })}
                  className="flex size-5 items-center justify-center rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  aria-label="Limpar campo"
                >
                  <X className="size-3 text-destructive" />
                </button>
              )}
            </div>
          )}
        </div>

        <div id="workspace-rules" className="space-y-2 pt-1" role="status" aria-live="polite">
          {validationRules.map((rule) => (
            <div
              key={rule.label}
              className={cn(
                'flex items-start gap-2.5 text-[13px] leading-snug transition-colors',
                rule.neutral
                  ? 'text-muted-foreground'
                  : rule.invalid
                    ? 'text-destructive'
                    : rule.valid
                      ? 'text-primary'
                      : 'text-muted-foreground',
              )}
            >
              {rule.neutral ? (
                <Info className="mt-0.5 size-3.5 shrink-0" />
              ) : rule.invalid ? (
                <X className="mt-0.5 size-3.5 shrink-0" />
              ) : rule.valid ? (
                <Check className="mt-0.5 size-3.5 shrink-0" />
              ) : (
                <div className="mt-0.5 size-3.5 shrink-0 rounded-full border border-border" />
              )}
              <span>{rule.label}</span>
            </div>
          ))}
        </div>

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!isValid || isSubmitting}
        className="w-full h-12 text-base font-medium gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Criando workspace...
          </>
        ) : (
          <>
            Criar workspace
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      {isValid && (
        <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pré-visualização da estrutura
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                {name.trim().charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{name.trim()}</p>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-border pl-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Layers className="size-3.5 text-primary/60" />
                <span>Espaços</span>
                <span className="text-xs text-muted-foreground/60">{"(áreas da empresa)"}</span>
              </div>
              <div className="ml-5 border-l border-dashed border-border pl-3.5 space-y-2">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <LayoutList className="size-3.5 text-primary/40" />
                  <span>Listas</span>
                  <span className="text-xs text-muted-foreground/60">{"(projetos, sprints...)"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}