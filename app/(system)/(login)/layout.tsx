import Loading from './loading'
import { type ReactNode, Suspense } from 'react'
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className={'relative h-screen bg-[url(https://bing.img.run/1920x1080.php)] bg-center bg-cover'}>
      <main className={'pt-20'}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </main>
  )
}
