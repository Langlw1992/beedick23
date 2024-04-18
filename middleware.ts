import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}

export async function middleware(req: NextRequest) {
  return await updateSession(req)
}
