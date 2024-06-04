'use server';

import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from './shared.types';
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

export async function upvoteAnswer({
  hasdownVoted,
  hasupVoted,
  path,
  answerId,
  userId,
}: AnswerVoteParams) {
  try {
    connectToDatabase();
    let updateQuery: any = {};
    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error('answer not found');

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function donwvoteAnswer({
  hasdownVoted,
  hasupVoted,
  path,
  answerId,
  userId,
}: AnswerVoteParams) {
  try {
    connectToDatabase();
    let updateQuery: any = {};
    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error('answer not found');
    // Increment authors reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}