import Question from '@/components/forms/Question';
import { ITag } from '@/database/tag.model';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function EditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { userId } = auth();

  if (!userId) redirect('/');

  const mongoUser = await getUserById({ userId });
  const question = await getQuestionById({ questionId: id });
  const defaultValues = {
    explanation: question.content,
    title: question.title,
    tags: question.tags.map((item: ITag) => item.name),
  };

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit question</h1>

      {mongoUser && (
        <div className="mt-9">
          <Question
            mongoUserId={JSON.stringify(mongoUser?._id)}
            defaultValues={defaultValues}
            questionId={id}
            type='edit'
          />
        </div>
      )}
    </div>
  );
}
