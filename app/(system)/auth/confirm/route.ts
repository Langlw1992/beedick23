import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * API route: confirm
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') || '/'
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  if (token_hash && type) {
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
    }
  }
}