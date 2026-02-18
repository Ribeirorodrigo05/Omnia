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
server/
  database/
    index.ts          # Conexão com Neon
    schema/           # Definições de tabelas Drizzle
  repositories/       # Acesso a dados
  services/           # Lógica de negócio
  actions/            # Server Actions
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

export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert
```

### Tipagem com drizzle-zod

Sempre inferir tipos diretamente do schema usando drizzle-zod:

```tsx
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { usersTable } from '../database/schema'

export const insertUserSchema = createInsertSchema(usersTable)
export const selectUserSchema = createSelectSchema(usersTable)

export type InsertUser = typeof insertUserSchema._type
export type SelectUser = typeof selectUserSchema._type
```

### Repository Pattern

```tsx
import { eq } from 'drizzle-orm'
import { db } from '../database'
import { usersTable, type NewUser, type User } from '../database/schema'

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
import { userRepository } from '../repositories/user-repository'
import { insertUserSchema } from '../database/schema/users'
import type { NewUser, User } from '../database/schema'

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

SEMPRE inferir tipos diretamente do schema Drizzle:

```tsx
import { usersTable } from '@/server/database/schema'

type User = typeof usersTable.$inferSelect
type NewUser = typeof usersTable.$inferInsert
```

Para validação com Zod:

```tsx
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { usersTable } from '@/server/database/schema'

const insertUserSchema = createInsertSchema(usersTable)
const selectUserSchema = createSelectSchema(usersTable)
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

## Checklist de Revisão

Antes de finalizar qualquer código, verificar:

- [ ] Server Components são usados por padrão
- [ ] `'use client'` só quando necessário
- [ ] URL state ao invés de API Routes
- [ ] Lógica de backend dentro de `server/`
- [ ] Types ao invés de interfaces
- [ ] Tipos inferidos do schema Drizzle
- [ ] Testes unitários para services
- [ ] Código sem comentários
- [ ] Validação com drizzle-zod