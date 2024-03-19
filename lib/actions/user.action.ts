'use server';

import User from '@/database/user.model';
import { connectToDataBase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function getUserById(params: any) {
  try {
    await connectToDataBase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
  }
}

export const createUser = async (params: CreateUserParams) => {
  try {
    await connectToDataBase();
    const newUser = await User.create(params);
    return newUser;
  } catch (error) {}
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDataBase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {}
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDataBase();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }

    // Delete user from database
    // Delete questions, Answrs,comments, etc.
    // get user questions ids
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      '_id'
    );
    await Question.deleteMany({ author: user._id });
    const deletedUser = await User.findById(user._id);
    return deletedUser;
    // TODO: delete user andwers,comments,etc.
  } catch (error) {}
};
