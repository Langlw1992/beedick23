import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="grid gap-4 mx-auto max-w-sm">
      <Skeleton className="h-[140px] rounded-xl" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8 w-[86%]" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8 w-[86%]" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8 w-[86%]" />
    </div>
  )
}
