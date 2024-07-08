'use server';

import Question from '@/database/question.model';
import Tag, { ITag } from '@/database/tag.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import console from 'console';
import { FilterQuery, ObjectId } from 'mongoose';

export async function getQuestions(params: GetQuestionsParams) {
  const { filter, page, pageSize, searchQuery } = params;
  try {
    connectToDatabase();

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });


    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for creating a question

    revalidatePath(path);
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name username picture',
      })
      .populate({
        path: 'tags',
        model: Tag,
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion({
  hasdownVoted,
  hasupVoted,
  path,
  questionId,
  userId,
}: QuestionVoteParams) {
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) throw new Error('Question not found');
    // Increment authors reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function donwvoteQuestion({
  hasdownVoted,
  hasupVoted,
  path,
  questionId,
  userId,
}: QuestionVoteParams) {
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) throw new Error('Question not found');
    // Increment authors reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion({
  path,
  questionId,
}: DeleteQuestionParams) {
  try {
    connectToDatabase();
    // const question = await Question.findOneAndDelete({
    //   _id: questionId,
    // });
    // if (!question) throw new Error('No Question found');
    // question.tags.forEach(async (element: ObjectId) => {
    //   const tag = await Tag.findOne(element);
    //   tag.questions.remove(question._id);
    //   tag.save();
    // });
    // if (question.answers.length !== 0) {
    //   question.answers.forEach(async (element: ObjectId) => {
    //     await Answer.findOneAndDelete(element);
    //   });
    // }
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      {
        $pull: { questions: questionId },
      }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion({
  content,
  path,
  questionId,
  tags,
  title,
}: EditQuestionParams) {
  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        content,
        title,
      },
      { new: true }
    ).populate({
      path: 'tags',
      model: Tag,
    });

    const actualTags = question.tags.map((item: ITag) => item.name);
    const removedTags = question.tags
      .filter((item: ITag) => !tags.includes(item.name))
      .map((element: ITag) => element._id);

    const newtags = tags.filter((item) => !actualTags.includes(item));

    if (removedTags.length !== 0) {
      await Question.findByIdAndUpdate(question._id, {
        $pullAll: { tags: removedTags },
      });
      removedTags.forEach(async (element: ObjectId) => {
        await Tag.findByIdAndUpdate(element, {
          $pull: { questions: questionId },
        });
      });
    }

    if (newtags.length !== 0) {
      const tagDocuments = [];
      for (const tag of newtags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
          { $setOnInsert: { name: tag }, $push: { questions: question._id } },
          { upsert: true, new: true }
        );

        tagDocuments.push(existingTag._id);
      }

      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } },
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();
    const questions = await Question.find()
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);
    return questions;
  } catch (error) {
    console.log(error);
  }
}
