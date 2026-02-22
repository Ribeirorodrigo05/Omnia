import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './auth-service'

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
    },
  },
}))

vi.mock('server-only', () => ({}))

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
})
