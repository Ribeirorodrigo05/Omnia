import 'server-only'

import { auth } from '@/lib/auth'
import { signUpSchema } from '@/validators'
import type { SignUpFormData } from '@/validators'

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
}
