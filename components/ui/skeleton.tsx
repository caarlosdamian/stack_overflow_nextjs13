import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-stone-900/10 dark:bg-slate-50/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
