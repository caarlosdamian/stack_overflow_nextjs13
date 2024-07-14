'use client';
import { Button } from '@/components/ui/button';
import { GlobalSearchFilters } from '@/constants/filters';
import { formUrlQuery } from '@/lib/utils';
import clsx from 'clsx';
import { useSearchParams, useRouter } from 'next/navigation';
import { type } from 'os';
import React, { useState } from 'react';

// build out ui
// build backend
// build out some feature frontend
// connect with backend

//

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get('type');
  const [active, setActive] = useState(typeParams || '');

  const handleFilter = (value: string) => {
    setActive(value);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'type',
      value,
    });
    router.push(newUrl);
  };

  return (
    <div className="flex items-center gap-5 px-5">
      {GlobalSearchFilters.map(({ value, name }) => (
        <Button
          className={`${clsx('light-border-2 small-medium rounded-2xl bg-light-700 px-5 py-2 capitalize text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500', active === value && 'primary-gradient text-white')}`}
          key={value}
          onClick={() => handleFilter(value)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default GlobalFilters;
