import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './auth-service'

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
      signInEmail: vi.fn(),
    },
  },
}))

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

import { auth } from '@/lib/auth'

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    const validInput = {
      name: 'Ana Lima',
      email: 'ana@test.com',
      password: 'senha1234',
      confirmPassword: 'senha1234',
    }

    it('deve criar conta com dados válidos', async () => {
      vi.mocked(auth.api.signUpEmail).mockResolvedValue({ user: { id: '1' } } as never)

      const result = await authService.signUp(validInput)

      expect(result).toEqual({ success: true })
      expect(auth.api.signUpEmail).toHaveBeenCalledWith({
        body: {
          name: 'Ana Lima',
          email: 'ana@test.com',
          password: 'senha1234',
        },
      })
    })

    it('deve retornar erro quando melhor-auth falhar', async () => {
      vi.mocked(auth.api.signUpEmail).mockRejectedValue(new Error('Email already taken'))

      const result = await authService.signUp(validInput)

      expect(result).toEqual({ error: 'Este email já está em uso ou ocorreu um erro inesperado.' })
    })

    it('deve lançar erro com email inválido', async () => {
      await expect(
        authService.signUp({ ...validInput, email: 'email-invalido' })
      ).rejects.toThrow()
    })

    it('deve lançar erro com senha muito curta', async () => {
      await expect(
        authService.signUp({ ...validInput, password: 'curta', confirmPassword: 'curta' })
      ).rejects.toThrow()
    })

    it('deve lançar erro com nome muito curto', async () => {
      await expect(
        authService.signUp({ ...validInput, name: 'A' })
      ).rejects.toThrow()
    })
  })

  describe('signIn', () => {
    const validInput = {
      email: 'ana@test.com',
      password: 'senha1234',
    }

    it('deve autenticar usuário com dados válidos', async () => {
      vi.mocked(auth.api.signInEmail).mockResolvedValue({ user: { id: '1' }, session: {} } as never)

      const result = await authService.signIn(validInput)

      expect(result).toEqual({ success: true })
      expect(auth.api.signInEmail).toHaveBeenCalledOnce()
    })

    it('deve retornar erro quando credenciais forem inválidas', async () => {
      vi.mocked(auth.api.signInEmail).mockRejectedValue(new Error('Invalid credentials'))

      const result = await authService.signIn(validInput)

      expect(result).toEqual({ error: 'Email ou senha incorretos.' })
    })

    it('deve lançar erro com email inválido', async () => {
      await expect(
        authService.signIn({ ...validInput, email: 'email-invalido' })
      ).rejects.toThrow()
    })

    it('deve lançar erro com senha vazia', async () => {
      await expect(
        authService.signIn({ ...validInput, password: '' })
      ).rejects.toThrow()
    })
  })
})
