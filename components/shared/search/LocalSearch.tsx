'use client';
import Image from 'next/image';
import React from 'react';
import { Input } from '@/components/ui/input';

interface Props {
  route: string;
  iconPosition: 'left' | 'right';
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  iconPosition,
  imgSrc,
  placeholder,
  route,
  otherClasses,
}: Props) => {
  return (
    <div className="relative w-full max-lg:hidden ">
      <div
        className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ${otherClasses}`}
      >
        {iconPosition === 'left' && (
          <Image
            src={imgSrc}
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={''}
          onChange={() => {}}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
        />
        {iconPosition === 'right' && (
          <Image
            src={imgSrc}
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSearch;
