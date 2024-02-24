import React from 'react';
import Link from 'next/link';
import RenderTag from '@/components/shared/renderTag/RenderTag';
import Metric from '@/components/shared/metric/Metric';
import { formatNumber, getTimeStamp } from '@/lib/utils';

interface Props {
  _id: number;
  title: string;
  tags: {
    _id: number;
    title: string;
  }[];
  upvotes: number;
  answers: Array<object>;
  createdAt: Date;
  views: number;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
}

const QuestionCard = ({
  _id,
  answers,
  author,
  tags,
  title,
  upvotes,
  views,
  createdAt,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed in add edit delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} name={tag.title} _id={tag._id} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          title={`  - ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium small-medium text-dark400_light700"
          value={author.name}
        />
        <div className="flex items-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="UpVotes"
            title="  Votes"
            textStyles="small-medium text-dark400_light800"
            value={formatNumber(upvotes)}
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            title="  Answers"
            textStyles="small-medium text-dark400_light800"
            value={formatNumber(answers.length)}
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            title="  Views"
            textStyles="small-medium text-dark400_light800"
            value={formatNumber(views)}

          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
