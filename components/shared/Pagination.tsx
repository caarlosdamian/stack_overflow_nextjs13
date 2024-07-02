'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || (1 as number);


  const goNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set(
      'page',
      (typeof page === 'string' ? parseInt(page) + 1 : page + 1).toString()
    );

    replace(`${pathname}?${params.toString()}`);
  };

  const goPrev = () => {
    const params = new URLSearchParams(searchParams);

    if (page === 2) {
      params.delete('page');
      replace(`${pathname}${params.toString()}`);
      return;
    }

    params.set(
      'page',
      (typeof page === 'string' ? parseInt(page) - 1 : page - 1).toString()
    );
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="mb-10 flex items-center justify-center gap-5">
      <Button
        onClick={goPrev}
        className="paragraph-medium btn text-dark300_light900  px-4 py-2"
      >
        Prev
      </Button>
      <p className="primary-gradient rounded-lg px-[14px] py-2">{page}</p>
      <Button
        onClick={goNext}
        disabled={
          typeof page === 'string'
            ? totalPages === parseInt(page)
            : totalPages === page
        }
        className="paragraph-medium btn text-dark300_light900  px-[14px] py-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
