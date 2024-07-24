import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'lucide-react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          Ask a Question
        </Button>
      </div>

      <div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
        <div className="hidden max-md:block">
          <Skeleton className="h-14 w-28" />
        </div>
      </div>

      <div className="my-10 hidden flex-wrap gap-6 md:flex">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-xl" />
          ))}
      </div>
      {/* 
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4" />

        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>

      <Skeleton className="mt-10 hidden flex-wrap gap-3 md:flex" /> */}
    </section>
  );
}
