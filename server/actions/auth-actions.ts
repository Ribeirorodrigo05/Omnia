'use server'

import { redirect } from 'next/navigation'
import { authController } from '@/server/controllers/auth-controller'
import type { SignUpFormData, SignInFormData } from '@/validators'

export async function signUpAction(data: SignUpFormData) {
  const result = await authController.signUp(data)

  if (result?.error) {
    return { error: result.error }
  }

  redirect('/home')
}

export async function signInAction(data: SignInFormData) {
  const result = await authController.signIn(data)

  if (result?.error) {
    return { error: result.error }
  }

  redirect('/home')
}
