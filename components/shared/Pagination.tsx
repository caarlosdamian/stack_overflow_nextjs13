'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

const Pagination = ({ isNext }: { isNext: boolean }) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const router = useRouter();

  // const goNext = () => {
  // const params = new URLSearchParams(searchParams);
  // params.set('page', (page + 1).toString());

  // replace(`${pathname}?${params.toString()}`);

  //   const newUrl = formUrlQuery({
  //     params: searchParams.toString(),
  //     key: 'page',
  //     value: (page + 1).toString(),
  //   });
  //   router.push(newUrl);
  // };

  // const goPrev = () => {
  //   if (page === 2) {
  //     const newUrl = removeKeysFromQuery({
  //       params: searchParams.toString(),
  //       keys: ['page'],
  //     });
  //     router.push(newUrl, { scroll: false });
  //     return;
  //   }

  //   const newUrl = formUrlQuery({
  //     params: searchParams.toString(),
  //     key: 'page',
  //     value: (page - 1).toString(),
  //   });
  //   router.push(newUrl);
  // };

  const handleNavegation = (direction: string) => {
    if (page === 2 && direction === 'prev') {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ['page'],
      });
      router.push(newUrl, { scroll: false });
      return;
    }
    const newPage = direction === 'next' ? page + 1 : page - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: newPage.toString(),
    });
    router.push(newUrl);
  };

  if (!isNext && page === 1) return null;

  return (
    <div className="mb-10 flex items-center justify-center gap-5">
      <Button
        onClick={() => handleNavegation('prev')}
        disabled={page === 1}
        className="paragraph-medium btn text-dark300_light900  light-border-2 px-4 py-2"
      >
        Prev
      </Button>
      <p className="body-semibold primary-gradient rounded-lg px-[14px] py-2">
        {page}
      </p>
      <Button
        onClick={() => handleNavegation('next')}
        disabled={!isNext}
        className="paragraph-medium btn text-dark300_light900  light-border-2 px-[14px] py-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
