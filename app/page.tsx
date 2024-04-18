import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <Link href={'/login'}>Login</Link>
      <Link href={'/about'}>About</Link>
    </main>
  )
}
