import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import type { Session } from '@/lib/auth'

export async function layoutGuard(): Promise<Session> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
    query: {
      disableCookieCache: true,
    },
  })

  if (!session) {
    await auth.api.signOut({ headers: requestHeaders }).catch(() => {})
    redirect('/sign-in')
  }

  return session
}
