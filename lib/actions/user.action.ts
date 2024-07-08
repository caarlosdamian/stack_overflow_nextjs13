/* eslint-disable no-unused-vars */
'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllTagsParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Answer from '@/database/answer.model';

export async function getUserById(params: { userId: string }) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error('User not found');
    }
    const totalQuestions = await Question.countDocuments({ author: user._id });

    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalAnswers, totalQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    // @ts-ignore
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.
    // @ts-ignore
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { username: { $regex: new RegExp(searchQuery, 'i') } },
        { name: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }


    const users = await User.find(query).sort({ createAt: -1 });

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    const { path, questionId, userId } = params;

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(userId, {
        $pull: { saved: questionId },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { saved: questionId },
      });
    }

    revalidatePath(path);
  } catch (error) {}
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  // @ts-ignore
  const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

  const query: FilterQuery<typeof Question> = {};

  if (searchQuery) {
    query.$or = [
      { title: { $regex: new RegExp(searchQuery, 'i') } },
      { content: { $regex: new RegExp(searchQuery, 'i') } },
    ];
  }
  try {
    connectToDatabase();
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        {
          path: 'author',
          model: User,
          select: '_id clerkId name username picture',
        },
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions({
  userId,
  page = 1,
  pageSize = 10,
}: GetUserStatsParams) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const questions = await Question.find({ author: user._id })
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ views: -1, upvotes: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    if (!questions) {
      throw new Error('Questions not found');
    }
    const count = await Question.countDocuments({ author: user._id });
    const totalPages = Math.ceil(count / pageSize);

    return {
      questions,
      totalPages,
    };
  } catch (error) {
    console.log(error);
  }
}

export const getUserAnswers = async ({
  userId,
  page = 1,
  pageSize = 10,
}: GetUserStatsParams) => {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error('User not found');

    const answers = await Answer.find({ author: user._id })
      .populate({
        path: 'author',
        model: User,
      })
      .populate({
        path: 'question',
        model: Question,
        select: '_id title',
      })
      .sort({ upvotes: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    const totalPages = Math.ceil(totalAnswers / pageSize);
    return {
      answers,
      totalPages,
    };
  } catch (error) {
    console.log(error);
  }
};

// export async function getAllUsers(params: GetAllTagsParams) {
//   try {
//     connectToDatabase();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
