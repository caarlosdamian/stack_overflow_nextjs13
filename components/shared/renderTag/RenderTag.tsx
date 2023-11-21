import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import React from 'react';

interface Props {
  _id: number | string;
  totalQuestions?: number;
  showCount?: boolean;
  name: string;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-dark500_light500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="text-dark500_light700 small-medium">{totalQuestions}+</p>
      )}
    </Link>
  );
};

export default RenderTag;
