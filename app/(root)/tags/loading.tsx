import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1 max-sm:w-full max-sm:flex-auto " />
        <Skeleton className="h-14 w-[170px] max-sm:w-full" />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="h-60 w-full rounded-2xl sm:w-[260px]"
            />
          ))}
      </div>
    </section>
  );
};

export default Loading;
