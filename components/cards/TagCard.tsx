import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';

interface Props {
  tag: {
    _id: string;
    name: string;
    questions: string[];
  };
}

const TagCard = async ({ tag }: Props) => {
  return (
    <Link
      href={tag._id}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-start rounded-2xl border p-8">
        <Badge className="background-light800_dark400 text-dark300_light700 rounded-md border-none px-5 py-[6px] text-base font-bold">
          {tag.name}
        </Badge>
        <div className="mt-5">
          <p className="text-dark500_light700 text-xs">
            JavaScript, often abbreviated as JS, is a programming language that
            is one of the core technologies of the World Wide Web, alongside
            HTML and CSS
          </p>
        </div>
        <div className="mt-[14px] flex items-center gap-3">
          <p className="text-sm text-primary-500 ">
            {tag.questions.length}+
          </p>
          <p className="text-dark500_light700 text-xs">Questions</p>
        </div>
      </article>
    </Link>
  );
};

export default TagCard;
