import React from 'react';
import QuestionCard from '../cards/QuestionCard';
import NoResult from './NoResult';


const QuestionTab = ({ questions }: { questions: any }) => {
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
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
          title="There’s no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )}
      {/* <button onClick={()=>goNext}>prueba</button> */}
    </div>
  );
};

export default QuestionTab;
