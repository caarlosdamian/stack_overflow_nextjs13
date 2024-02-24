import HomeFilters from '@/components/home/homeFilters/HomeFilters';
import Filter from '@/components/shared/filter/Filter';
import NoResult from '@/components/shared/noResult/NoResult';
import QuestionCard from '@/components/cards/questionCard/QuestionCard';
import LocalSearch from '@/components/shared/search/LocalSearch';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import Link from 'next/link';
import React from 'react';

const questions = [
  {
    _id: 1,
    title: 'Sample Title 1',
    tags: [
      {
        _id: 101,
        title: 'Tag 1',
      },
      {
        _id: 102,
        title: 'Tag 2',
      },
    ],
    upvotes: 10234534,
    answers: [],
    createdAt: new Date('2023-12-25T00:00:00Z'),
    views: 100,
    author: {
      _id: 'user1',
      name: 'John Doe',
      picture: 'https://example.com/user1.jpg',
    },
  },
  {
    _id: 2,
    title: 'Sample Title 2',
    tags: [
      {
        _id: 103,
        title: 'Tag 3',
      },
      {
        _id: 104,
        title: 'Tag 4',
      },
    ],
    upvotes: 5,
    answers: [],
    createdAt: new Date('2023-01-15T08:30:00Z'),
    views: 50,
    author: {
      _id: 'user2',
      name: 'Jane Smith',
      picture: 'https://example.com/user2.jpg',
    },
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-questions" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex w-full justify-between gap-5 sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <HomeFilters />
        <div className=" mt-10 flex w-full flex-col gap-6">
          {questions.length > 0 ? (
            questions.map((question) => (
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
              />
            ))
          ) : (
            <NoResult
              title="Theres's no question to show"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
              link="/"
              linktitle="Ask a Question"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
