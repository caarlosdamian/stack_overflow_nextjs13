'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ReloadIcon } from '@radix-ui/react-icons';
import GlobalFilters from './search/GlobalFilters';
import { globalSearch } from '@/lib/actions/general.action';

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const global = searchParams.get('global');
  const type = searchParams.get('type');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        //
        // GLOBAL SEARCH
        const res = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        throw new Error();
      } finally {
        setIsLoading(false);
      }
    };
    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string | null, id: string) => {
    switch (type) {
      case 'question':
        return `/question/${id}`;
      case 'tag':
        return `/tags/${id}`;
      case 'answer':
        return `/question/${id}`;
      case 'user':
        return `/profile/${id}`;

      default:
        return '/';
    }
  };
  //
  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <div className="flex items-center justify-start gap-5 px-6 pb-6">
        <p className="base-semibold text-dark400_light800">Type:</p>
        <GlobalFilters />
      </div>
      <div className="h-px w-full border-none bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="flex flex-col space-y-5 pb-6">
        <p className="text-dark400_light900 paragraph-semibold px-5 pt-6">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 size-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : result.length !== 0 ? (
          <div className="flex flex-col gap-2">
            {result.map((item, index) => (
              <Link
                // @ts-ignore
                href={renderLink(item.type, item.id)}
                // @ts-ignore
                key={item.type + item.id + index}
                className=" flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
              >
                <Image
                  src="/assets/icons/tag.svg"
                  alt="tag"
                  className="invert-colors mt-1 object-contain"
                  width={18}
                  height={18}
                />
                <div className="flex flex-col">
                  <p className="body-medium text-dark200_light800 line-clamp-1">
                    {/* @ts-ignore */}
                    {item.title}
                  </p>
                  <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                    {/* @ts-ignore */}
                    {item.type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-center flex-col px-5">
            <p className="text-5xl">🫣</p>
            <p className="text-dark200_light800 body-regular px-5 py-2.5">
              Oops, no results found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
