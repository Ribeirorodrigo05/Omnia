---
description: Padrões de desenvolvimento do projeto Omnia
applyTo: '**'
---

# Omnia - Padrões de Desenvolvimento

## Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: Neon (PostgreSQL Serverless)
- **Validação**: Zod + drizzle-zod
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui + shadcn blocks

---

## Arquitetura do Projeto

### Estrutura de Pastas

```
app/
  (private)/          # Rotas autenticadas
  (public)/           # Rotas públicas
  globals.css
  layout.tsx
  page.tsx
components/
  ui/                 # Componentes reutilizáveis
lib/
  utils.ts
  auth.ts             # Configuração better-auth (server)
  auth-client.ts      # Cliente React better-auth
server/
  database/
    index.ts          # Conexão com Neon
    schema/           # Definições de tabelas Drizzle
  repositories/       # Acesso a dados
  services/           # Lógica de negócio
  actions/            # Server Actions
  types/
    index.ts          # Único ponto de exportação de tipos
validators/
  index.ts            # Re-export de todos os validators
  sign-up.ts          # Exemplo: schema Zod + type inferido
proxy.ts              # Proteção de rotas (substitui middleware no Next.js 16)
```

---

## Regras de Código

### 1. Server Components por Padrão

Todos os componentes são Server Components por padrão. Usar `'use client'` apenas quando necessário:

```tsx
export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

### 2. Quando usar 'use client'

Usar `'use client'` **SOMENTE** em componentes com interatividade:

**Situações que EXIGEM 'use client':**
- Componentes com `onClick`, `onChange`, `onSubmit`
- Uso de hooks: `useState`, `useEffect`, `useRef`, `useSearchParams`
- Inputs, botões com handlers, selects, checkboxes
- Componentes que manipulam DOM diretamente

**Situações que NÃO precisam de 'use client':**
- Componentes apenas de exibição (listas, cards, textos)
- Formulários usando Server Actions com `action={serverAction}`
- Componentes que apenas recebem props e renderizam

#### Exemplo: Botão com Interação

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <Button onClick={() => setCount(count + 1)}>
      Clicado {count} vezes
    </Button>
  )
}
```

#### Exemplo: Formulário com Input Controlado

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function SearchInput() {
  const [query, setQuery] = useState('')

  return (
    <div className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      <Button onClick={() => console.log(query)}>Buscar</Button>
    </div>
  )
}
```

#### Exemplo: Formulário SEM 'use client' (Server Action)

```tsx
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createUser } from '@/server/actions/user-actions'

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <Input name="name" placeholder="Nome" />
      <Input name="email" type="email" placeholder="Email" />
      <Button type="submit">Criar Usuário</Button>
    </form>
  )
}
```

---

### 3. Biblioteca de Componentes (shadcn/ui)

TODO componente de UI deve usar shadcn/ui. Nunca criar componentes customizados quando existir equivalente no shadcn:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
```

**Regras:**
- Usar componentes de `@/components/ui/` (shadcn)
- Para layouts complexos, usar shadcn blocks
- Estilização adicional apenas com Tailwind classes
- Nunca usar CSS modules ou styled-components

---

### 4. URL State ao invés de API Routes

Utilizar searchParams e URL state para gerenciamento de estado. Evitar API Routes para operações que podem ser feitas via URL state:

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { sort, filter } = await searchParams
  const data = await getData({ sort, filter })
  
  return <DataList data={data} />
}
```

Para atualização de URL no cliente:

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SortSelector() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <button onClick={() => updateSorting('asc')}>Ordenar</button>
  )
}
```

### 5. Server Actions para Mutations

Usar Server Actions para todas as operações de mutação:

```tsx
'use server'

import { revalidatePath } from 'next/cache'
import { productService } from '@/server/services/product-service'

export async function createProduct(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    price: Number(formData.get('price')),
  }
  
  await productService.create(data)
  revalidatePath('/products')
}
```

---

## Backend (Pasta server/)

### Estrutura Obrigatória

Todo código de backend DEVE estar dentro da pasta `server/`:

```
server/
  database/
    index.ts              # Conexão Drizzle + Neon
    schema/
      users.ts
      products.ts
      index.ts            # Re-export de todos schemas
  repositories/
    user-repository.ts
    product-repository.ts
  services/
    user-service.ts
    product-service.ts
  actions/
    user-actions.ts
    product-actions.ts
  types/
    index.ts              # Único ponto de exportação de tipos
```

### Conexão com Neon

```tsx
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle({ client: sql, schema })
```

### Definição de Schema (Drizzle)

O schema define apenas as tabelas. **Nenhum `type` deve ser declarado no schema.**

```tsx
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})
```

### Tipos Centralizados (server/types/index.ts)

Todos os tipos derivados do schema devem ser declarados **exclusivamente** em `server/types/index.ts`. Nunca declarar tipos dentro dos arquivos de schema ou repositories.

```tsx
import type { usersTable, productsTable } from '@/server/database/schema'

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert

export type Product = typeof productsTable.$inferSelect
export type NewProduct = typeof productsTable.$inferInsert
```

Importar sempre de `@/server/types`:

```tsx
import type { User, NewUser } from '@/server/types'
```

### Tipagem com drizzle-zod

Os schemas Zod e seus tipos derivados também ficam em `server/types/index.ts`:

```tsx
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { usersTable } from '@/server/database/schema'

export const insertUserSchema = createInsertSchema(usersTable)
export const selectUserSchema = createSelectSchema(usersTable)

export type User = typeof selectUserSchema._type
export type NewUser = typeof insertUserSchema._type
```

### Repository Pattern

```tsx
import { eq } from 'drizzle-orm'
import { db } from '@/server/database'
import { usersTable } from '@/server/database/schema'
import type { NewUser, User } from '@/server/types'

export const userRepository = {
  async findAll(): Promise<User[]> {
    return db.select().from(usersTable)
  },

  async findById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
    return user
  },

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(usersTable).values(data).returning()
    return user
  },

  async update(id: number, data: Partial<NewUser>): Promise<User | undefined> {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()
    return user
  },

  async delete(id: number): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id))
  },
}
```

### Service Layer

```tsx
import { userRepository } from '@/server/repositories/user-repository'
import { insertUserSchema } from '@/server/types'
import type { NewUser, User } from '@/server/types'

export const userService = {
  async getAll(): Promise<User[]> {
    return userRepository.findAll()
  },

  async getById(id: number): Promise<User | undefined> {
    return userRepository.findById(id)
  },

  async create(data: unknown): Promise<User> {
    const validatedData = insertUserSchema.parse(data)
    return userRepository.create(validatedData)
  },

  async update(id: number, data: unknown): Promise<User | undefined> {
    const validatedData = insertUserSchema.partial().parse(data)
    return userRepository.update(id, validatedData)
  },

  async delete(id: number): Promise<void> {
    return userRepository.delete(id)
  },
}
```

---

## Regras de TypeScript

### 1. Types ao invés de Interfaces

SEMPRE usar `type` ao invés de `interface`:

```tsx
type UserProps = {
  id: number
  name: string
  email: string
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
```

### 2. Inferência de Tipos do Schema

Tipos são **sempre** declarados em `server/types/index.ts`, inferidos do schema Drizzle. Nunca declarar `type` dentro de arquivos de schema, repository ou service.

```tsx
import type { usersTable } from '@/server/database/schema'

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert
```

Importar sempre de `@/server/types`, nunca diretamente do schema:

```tsx
import type { User, NewUser } from '@/server/types'
```

Para validação com Zod, os schemas também ficam em `server/types/index.ts`:

```tsx
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { usersTable } from '@/server/database/schema'

export const insertUserSchema = createInsertSchema(usersTable)
export const selectUserSchema = createSelectSchema(usersTable)
```

---

## Testes

### Regra Obrigatória

Todo service DEVE ter testes unitários correspondentes:

```
server/
  services/
    user-service.ts
    user-service.test.ts
    product-service.ts
    product-service.test.ts
```

### Estrutura de Teste

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from './user-service'
import { userRepository } from '../repositories/user-repository'

vi.mock('../repositories/user-repository')

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
      ]
      vi.mocked(userRepository.findAll).mockResolvedValue(mockUsers)

      const result = await userService.getAll()

      expect(result).toEqual(mockUsers)
      expect(userRepository.findAll).toHaveBeenCalledOnce()
    })
  })

  describe('create', () => {
    it('deve criar um usuário com dados válidos', async () => {
      const newUser = { name: 'New User', email: 'new@test.com' }
      const createdUser = { id: 1, ...newUser }
      vi.mocked(userRepository.create).mockResolvedValue(createdUser)

      const result = await userService.create(newUser)

      expect(result).toEqual(createdUser)
    })

    it('deve lançar erro com dados inválidos', async () => {
      const invalidData = { name: '' }

      await expect(userService.create(invalidData)).rejects.toThrow()
    })
  })
})
```

---

## Restrições de Geração de Código

### Proibições

1. **Sem comentários no código gerado**
   - Código deve ser autoexplicativo
   - Nomes de variáveis e funções devem ser descritivos

2. **Sem API Routes desnecessárias**
   - Usar Server Actions para mutations
   - Usar URL state para filtros/ordenação
   - API Routes apenas para webhooks externos ou integrações

3. **Sem lógica de backend fora de server/**
   - Toda lógica de dados deve estar em `server/`
   - Components não devem acessar `db` diretamente

4. **Sem interfaces**
   - Usar apenas `type`

---

## Validators (pasta validators/)

Todas as validações Zod de formulários devem ser declaradas na pasta `validators/`. Cada arquivo agrupa schemas e tipos de uma entidade/feature.

**Regras obrigatórias:**
- Schema Zod e o `type` inferido (`z.infer`) ficam **no mesmo arquivo** dentro de `validators/`
- Nunca declarar schemas Zod ou `type z.infer` dentro de componentes
- Exportar tudo via `validators/index.ts`
- Importar sempre de `@/validators`

```tsx
import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
```

```tsx
export * from './sign-up'
```

Importar no componente:

```tsx
import { signUpSchema, type SignUpFormData } from '@/validators'
```

> **Atenção**: tipos inferidos de schemas Drizzle pertencem a `server/types/index.ts`. Tipos inferidos de schemas Zod de formulários pertencem a `validators/<feature>.ts`.

---

## Checklist de Revisão

Antes de finalizar qualquer código, verificar:

- [ ] Server Components são usados por padrão
- [ ] `'use client'` só quando necessário
- [ ] URL state ao invés de API Routes
- [ ] Lógica de backend dentro de `server/`
- [ ] Types ao invés de interfaces
- [ ] Tipos inferidos do schema Drizzle
- [ ] Tipos declarados exclusivamente em `server/types/index.ts`
- [ ] Importações de types sempre via `@/server/types`
- [ ] Schemas Zod de formulários em `validators/<feature>.ts`
- [ ] Types `z.infer` declarados junto ao schema em `validators/<feature>.ts`
- [ ] Importações de validators sempre via `@/validators`
- [ ] Testes unitários para services
- [ ] Código sem comentários
- [ ] Validação com drizzle-zod