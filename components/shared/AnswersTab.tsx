import { SearchParamsProps } from '@/types';
import React from 'react';
import Pagination from './Pagination';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswersTab = async ({ userId, searchParams, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
  });
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {/*  @ts-ignore */}
      {result?.answers?.length > 0 &&
        result?.answers.map((answe) => (
          <AnswerCard
            key={answe._id}
            _id={answe._id}
            clerkId={clerkId}
            question={answe.question}
            author={answe.author}
            upvotes={answe.upvotes}
            createdAt={answe.createdAt}
          />
        ))}
      {/*  @ts-ignore */}
      {result?.totalPages > 1 && (
        <Pagination
          totalPages={result && result.totalPages ? result.totalPages : 1}
        />
      )}
    </div>
  );
};

export default AnswersTab;