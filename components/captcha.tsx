'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function Captcha() {
  const { data, refetch, isError } = useQuery(api.getCaptcha())
  const refreshCaptcha = async () => {
    await refetch()
  }
  if (isError) return <div>Failed to load</div>
  return (
    <div className={'relative h-9'}>
      <Image
        className={'cursor-pointer rounded-md'}
        onClick={refreshCaptcha}
        src={`data:image/png;base64,${data}`}
        alt={'验证码'}
        fill
      />
    </div>
  )
}
