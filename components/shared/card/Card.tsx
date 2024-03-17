import { Badge } from '@/components/ui/badge';
import { dummyTools } from '@/utils';
import Image from 'next/image';
import React from 'react';
import Stats from '../stats/Stats';

export const Card = () => {
  return (
    <div className="card-wrapper flex min-h-[209px] w-full flex-col gap-6 rounded-[10px] px-[44px] py-[36px] ">
      <div className="flex flex-col gap-[14px]">
        <h3 className="h3-semibold text-dark200_light900 line-clamp-1">
          The Lightning Component c:LWC_PizzaTracker generated invalid output
          for field status. Error How to solve this
        </h3>
        <div className="flex items-center gap-2">
          {dummyTools.map((item) => (
            <Badge
              key={item._id}
              className="subtle-medium background-light800_dark300 text-dark500_light500 rounded-md border-none px-4 py-2 uppercase"
            >
              {item.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <Image
              src="/assets/images/avatar.svg"
              width={20}
              height={20}
              alt="avatar"
            />
            <span className="body-regular text-dark400_light700">Satheesh</span>
          </div>
          <span className="text-dark400_light700 small-regular line-clamp-1 max-sm:hidden">
            • asked 2 mins ago
          </span>
        </div>
        <div className="flex items-center gap-[9px]">
          <Stats icon="/assets/icons/like.svg" label="Votes" count="7" />
          <Stats icon="/assets/icons/message.svg" label="Answers" count="7" />
        </div>
      </div>
    </div>
  );
};
