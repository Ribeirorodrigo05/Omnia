import 'server-only'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { signUpSchema, signInSchema } from '@/validators'
import type { SignUpFormData, SignInFormData } from '@/validators'

export const authService = {
  async signUp(data: SignUpFormData) {
    const validated = signUpSchema.parse(data)

    try {
      await auth.api.signUpEmail({
        body: {
          name: validated.name,
          email: validated.email,
          password: validated.password,
        },
      })

      return { success: true }
    } catch {
      return { error: 'Este email já está em uso ou ocorreu um erro inesperado.' }
    }
  },

  async signIn(data: SignInFormData) {
    const validated = signInSchema.parse(data)

    try {
      await auth.api.signInEmail({
        body: {
          email: validated.email,
          password: validated.password,
        },
        headers: await headers(),
      })

      return { success: true }
    } catch {
      return { error: 'Email ou senha incorretos.' }
    }
  },
}
