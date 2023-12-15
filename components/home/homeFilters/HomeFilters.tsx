'use client';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import React from 'react';

const HomeFilters = () => {
  const isActive = 'newest';
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          className={`body-medium cursor-pointer rounded-lg px-6 py-3 capitalize shadow-none ${
            isActive === item.value
              ? 'bg-primary-100 text-primary-500'
              : 'bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:hover:bg-dark-300'
          }`}
          key={item.value}
          onClick={() => {
            console.log(item);
          }}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
