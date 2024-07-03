import React from 'react';
import QuestionCard from '../cards/QuestionCard';
import NoResult from './NoResult';
import { SearchParamsProps } from '@/types';
import { getUserQuestions } from '@/lib/actions/user.action';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionTab = async ({ userId, searchParams,clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {result?.questions.length > 0 ? (
        result?.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
            clerkId={clerkId}
          />
        ))
      ) : (
        <NoResult
          title="There’s no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )}
      {result?.totalPages !== 1 && (
        <Pagination totalPages={result.totalPages as unknown as number} />
      )}
    </div>
  );
};

export default QuestionTab;
