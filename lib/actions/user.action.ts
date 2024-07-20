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
import { BadgeCriteriaType } from '@/types';
import { assingBadges } from '../utils';

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

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: '$upvotes' },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: '$upvotes' },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: '$upvotes' },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: '$upvotes' },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
        },
      },
    ]);

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpvotes || 0,
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpvotes || 0,
      },
      { type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews || 0 },
    ];
    // @ts-ignore
    const badgeCounts = assingBadges({ criteria });

    return {
      user,
      totalAnswers,
      totalQuestions,
      badgeCounts,
      reputation: user.reputation,
    };
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
    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = {};

    let sortOptions = {};
    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 };
        break;
      case 'top_contributors':
        sortOptions = { reputation: -1 };
        break;
      case 'old_users':
        sortOptions = { joinedAt: 1 };
        break;

      default:
        break;
    }

    if (searchQuery) {
      query.$or = [
        { username: { $regex: new RegExp(searchQuery, 'i') } },
        { name: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    const userToSkip = (page - 1) * pageSize;

    const users = await User.find(query).sort(sortOptions);
    const userCount = await User.countDocuments(query);

    const isNext = userCount > userToSkip + users.length;

    return { users, isNext };
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
  const { clerkId, page = 1, pageSize = 2, filter, searchQuery } = params;

  const query: FilterQuery<typeof Question> = {};
  const questionsToSkip = (page - 1) * pageSize;
  if (searchQuery) {
    query.$or = [
      { title: { $regex: new RegExp(searchQuery, 'i') } },
      { content: { $regex: new RegExp(searchQuery, 'i') } },
    ];
  }

  let sortOptions = {};
  switch (filter) {
    case 'most_recent':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'most_voted':
      sortOptions = { upvotes: -1 };
      break;
    case 'most_viewed':
      sortOptions = { views: -1 };
      break;
    case 'most_answered':
      sortOptions = { answers: -1 };

      break;

    default:
      break;
  }

  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: questionsToSkip,
        limit: pageSize,
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

    const savedQuestionCount = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
    });

    const savedQuestions = user.saved;

    const isNext =
      savedQuestionCount.saved.length > savedQuestions.length + questionsToSkip;

    return { questions: savedQuestions, isNext };
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
    const skipAmount = pageSize * (page - 1);
    const questions = await Question.find({ author: user._id })
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize);
    if (!questions) {
      throw new Error('Questions not found');
    }
    const count = await Question.countDocuments({ author: user._id });
    const totalPages = Math.ceil(count / pageSize);
    const isNext = count > skipAmount + questions.length;
    return {
      questions,
      totalPages,
      isNext,
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
    const skipCount = pageSize * (page - 1);
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
      .skip(skipCount)
      .limit(pageSize);
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    const totalPages = Math.ceil(totalAnswers / pageSize);

    const isNext = totalAnswers > skipCount + answers.length;
    return {
      answers,
      isNext,
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
