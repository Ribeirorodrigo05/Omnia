'use server'

import { redirect } from 'next/navigation'
import { authController } from '@/server/controllers/auth-controller'
import type { SignUpFormData } from '@/validators'

export async function signUpAction(data: SignUpFormData) {
  const result = await authController.signUp(data)

  if (result?.error) {
    return { error: result.error }
  }

  redirect('/home')
}
