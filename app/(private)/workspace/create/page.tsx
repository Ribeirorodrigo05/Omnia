import { Building2, Layers, LayoutList } from 'lucide-react'
import Image from 'next/image'
import { CreateWorkspaceForm } from './_components/create-workspace-form'

export const metadata = {
  title: 'Criar Workspace - Omnia',
  description: 'Crie seu workspace para organizar sua empresa, áreas e projetos.',
}

export default function CreateWorkspacePage() {
  return (
    <main className="min-h-svh flex bg-background max-w-360 mx-auto rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md space-y-10">
            
          <Image
            src="https://i.ibb.co/CK6PbDFH/OMNIA-Logo-Expandida-Color-3x.png"
            alt="Omnia"
            width={300}
            height={32}
            priority
            className='flex  mx-auto'
          />
          <div className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Crie seu workspace
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">
              O workspace representa a sua organização. Dentro dele, você cria{" "}
              <strong className="font-medium text-foreground">espaços</strong> para cada
              área da empresa, e dentro dos espaços organiza{" "}
              <strong className="font-medium text-foreground">listas</strong> com
              projetos, sprints, mapeamentos e tudo o que sua empresa moderna precisa.
            </p>
          </div>

          <CreateWorkspaceForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-120 xl:w-135 flex-col items-center justify-center bg-muted/40 border-l border-border p-12">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Como funciona
              </p>
            </div>
            <div className="space-y-0">
              <div className="relative flex gap-4 pb-8">
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Building2 className="size-5" />
                  </div>
                  <div className="mt-2 h-full w-px bg-border" />
                </div>
                <div className="pt-1 pb-2">
                  <p className="text-sm font-semibold text-foreground">Workspace</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    A sua organização. O espaço central que contém toda a estrutura da empresa.
                  </p>
                </div>
              </div>
              <div className="relative flex gap-4 pb-8">
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Layers className="size-5" />
                  </div>
                  <div className="mt-2 h-full w-px bg-border" />
                </div>
                <div className="pt-1 pb-2">
                  <p className="text-sm font-semibold text-foreground">Espaços</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Cada área da empresa vira um espaço. Engenharia, Marketing, Produto, Design e
                    o que mais fizer sentido.
                  </p>
                </div>
              </div>
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary/70">
                    <LayoutList className="size-5" />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-foreground">Listas</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Dentro de cada espaço, organize projetos, sprints, mapeamentos e qualquer
                    iniciativa do seu time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Omnia Corp</p>
                <p className="text-xs text-muted-foreground">3 espaços ativos</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { name: "Engenharia", count: "12 listas" },
                { name: "Design", count: "8 listas" },
                { name: "Marketing", count: "5 listas" },
              ].map((space) => (
                <div
                  key={space.name}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="size-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{space.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{space.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
