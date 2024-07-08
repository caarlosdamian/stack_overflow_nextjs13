'use client';

import { HomePageFilters } from '@/constants/filters';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('filter');
  const [filter, setFilter] = useState<string | null>(query || '');

  const handleFilter = (element: string) => {
    if (element === filter) {
      setFilter(null);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });
      router.push(newUrl);
    } else {
      setFilter(element);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: element,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleFilter(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            filter === item.value
              ? 'bg-primary-100 text-primary-500'
              : 'bg-light-800 text-light-500'
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
