import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types';
import Tag, { ITag } from '@/database/tag.model';
import Question from '@/database/question.model';
import { FilterQuery } from 'mongoose';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    // Find interactiosn for the user and group by tags...
    // Interaction...

    return [{ _id: '1', name: 'tag' }];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({}).populate({
      path: 'questions',
      model: Question,
    });

    if (!tags) throw new Error('No tags available');

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  const { tagId, page = 1, pageSize = 10, searchQuery } = params;
  try {
    connectToDatabase();

    // const tag = await Tag.findById(tagId).populate({
    //   path: 'questions',
    //   model: Question,
    // });
    const tagfilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagfilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, 'i') } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId  username name picture' },
      ],
    });

    if (!tag) throw new Error('No tag available');

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
