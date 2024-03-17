import { dummyTools, dummyTopics } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from '../renderTag/RenderTag';

export const RightSidebar = () => {
  return (
    <section
      className="background-light900_dark200 light-border 
    right-0 top-0 flex h-screen w-[350px]  flex-col 
    gap-16 border-l
    p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden  max-sm:hidden"
    >
      <div className="flex flex-col gap-6">
        <h1 className="text-dark200_light900 h3-bold">Hot Network</h1>
        <div className="flex w-full flex-col gap-7">
          {dummyTopics.map((item) => (
            <Link
              href={`/questions/${item._id}`}
              key={item._id}
              className="flex items-start justify-between gap-2"
            >
              <span className="text-dark500_light700 body-medium">
                {item.title}
              </span>
              <Image
                src="/assets/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron-arrow"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="text-dark200_light900 h3-bold">Popular Tags</h1>
        <div className="flex flex-col gap-4">
          {dummyTools.map(({ _id, name, totalQuestions }) => (
            <RenderTag
              key={_id}
              _id={_id}
              name={name}
              totalQuestions={totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};
