'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const goNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (page + 1).toString());

    replace(`${pathname}?${params.toString()}`);
  };

  const goPrev = () => {
    const params = new URLSearchParams(searchParams);
    if (page === 2) {
      params.delete('page');
      replace(`${pathname}${params.toString()}`);
      return;
    }

    params.set('page', (page - 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="mb-10 flex items-center justify-center gap-5">
      <Button
        onClick={goPrev}
        disabled={page === 1}
        className="paragraph-medium btn text-dark300_light900  px-4 py-2"
      >
        Prev
      </Button>
      <p className="primary-gradient rounded-lg px-[14px] py-2">{page}</p>
      <Button
        onClick={goNext}
        disabled={totalPages === page}
        className="paragraph-medium btn text-dark300_light900  px-[14px] py-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
