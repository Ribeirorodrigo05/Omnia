import 'server-only'

import { authService } from '@/server/services/auth-service'
import type { SignUpFormData } from '@/validators'

export const authController = {
  async signUp(data: SignUpFormData) {
    return authService.signUp(data)
  },
}
