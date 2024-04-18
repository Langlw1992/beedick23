'use server'

import { z } from 'zod'
import { SCHEMA_USER_BASIC_INFO } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * 登录
 * @param formData 邮箱登录表单数据
 */
export async function singIn(formData: z.infer<typeof SCHEMA_USER_BASIC_INFO>) {
  const client = createClient()
  const validData = SCHEMA_USER_BASIC_INFO.parse(formData)
  const { error } = await client.auth.signInWithPassword(validData)
  if (error) {
    return { message: error.message, success: false }
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * 注册
 * @param formData 注册表单数据
 */
export async function signUp(formData: z.infer<typeof SCHEMA_USER_BASIC_INFO>) {
  const client = createClient()
  const validData = SCHEMA_USER_BASIC_INFO.parse(formData)
  const { error } = await client.auth.signUp(validData)
  if (error) {
    console.log(error)
    return
  }
  revalidatePath('/', 'layout')
  redirect('/')
}
