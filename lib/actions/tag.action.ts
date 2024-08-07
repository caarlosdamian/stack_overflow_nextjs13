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

export async function getAllTags({
  filter,
  page = 1,
  pageSize = 9,
  searchQuery,
}: GetAllTagsParams) {
  try {
    connectToDatabase();

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    let sortOptions = {};
    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 };
        break;
      case 'recent':
        sortOptions = { createdOn: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'old':
        sortOptions = { createdOn: 1 };
        break;

      default:
        break;
    }

    const tagsToSkip = (page - 1) * pageSize;
    const tags = await Tag.find(query)
      .populate({
        path: 'questions',
        model: Question,
      })
      .skip(tagsToSkip)
      .limit(pageSize)
      .sort(sortOptions);

    const tagsCount = await Tag.countDocuments(query);

    if (!tags) throw new Error('No tags available');

    const isNext = tagsCount > tagsToSkip + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  const { tagId, page = 1, pageSize = 2, searchQuery } = params;
  try {
    connectToDatabase();

    // const tag = await Tag.findById(tagId).populate({
    //   path: 'questions',
    //   model: Question,
    // });
    const tagfilter: FilterQuery<ITag> = { _id: tagId };
    const questionsToSkip = (page - 1) * pageSize;

    const tag = await Tag.findOne(tagfilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, 'i') } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: questionsToSkip,
        limit: pageSize,
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        {
          path: 'author',
          model: User,
          select: '_id clerkId  username name picture',
        },
      ],
    });

    const questionsCount = await Tag.findOne(tagfilter);
    const questions = tag.questions;
    const isNext =
      questionsCount.questions.length > questionsToSkip + questions.length;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotAnswers() {
  try {
    connectToDatabase();
    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestion: { $size: '$questions' } } },
      { $sort: { numberOfQuestion: -1 } },
      { $limit: 5 },
    ]);
    // .find()
    //   .sort({
    //     questions: -1,
    //   })
    //   .limit(5)
    //   .populate({ path: 'questions', model: Question });

    return tags;
  } catch (error) {
    console.log(error);
  }
}
