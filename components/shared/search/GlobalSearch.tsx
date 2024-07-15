'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from '../GlobalResult';

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = searchParams.get('global');
  const ref = useRef<any>();
  const [search, setSearch] = useState<string>(query || '');
  const [isOpen, setIsOpen] = useState(false);

  const resetStates = () => {
    setSearch('');
    setIsOpen(false);
  };

  useEffect(() => {
    const delaydeboundFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        });
        router.push(newUrl);
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ['global', 'type'],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);
    return () => clearTimeout(delaydeboundFn);
  }, [search, pathname, searchParams, router, query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        resetStates();
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ['global', 'type'],
        });
        router.push(newUrl, { scroll: false });
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [router, searchParams]);
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden" ref={ref}>
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '' && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
