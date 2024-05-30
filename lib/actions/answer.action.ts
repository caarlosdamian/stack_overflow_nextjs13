'use server';

import { CreateAnswerParams, GetAnswersParams } from './shared.types';
import { connectToDatabase } from '../mongoose';
import Question from '@/database/question.model';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';
import Answer from '@/database/answer.model';

export async function createAnswer(params: CreateAnswerParams) {
  const { author, content, path, question } = params;

  try {
    connectToDatabase();
    const newAnswer = await Answer.create({
      author,
      content,
      question,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  const { questionId } = params;
  try {
    connectToDatabase();
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: 'author',
        model: User,
      })
      .sort({ createdAt: -1 });
    return answers;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
