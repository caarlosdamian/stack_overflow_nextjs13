
import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.types';
import Tag from '@/database/tag.model';
import Question from '@/database/question.model';

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

export async function getAllTags(params:GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({})
    .populate({ path: 'questions', model: Question });

    if (!tags) throw new Error('No tags available');

    return {tags};
  } catch (error) {
    console.log(error);
    throw error;
  }
}