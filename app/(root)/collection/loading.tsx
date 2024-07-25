import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1 max-sm:w-full max-sm:flex-auto " />
        <Skeleton className="h-14 w-[170px] max-sm:w-full" />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-xl" />
          ))}
      </div>
    </section>
  );
}
