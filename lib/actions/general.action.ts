'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import { SearchParams } from './shared.types';
import User from '@/database/user.model';
import Answer from '@/database/answer.model';
import Tag from '@/database/tag.model';

const SearchableTypes = ['question', 'answer', 'user', 'tag'];

export async function globalSearc({ query, type }: SearchParams) {
  try {
    connectToDatabase();
    const regexQuery = { $regex: query, $options: 'i' };
    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: 'title', type: 'question' },
      { model: User, searchField: 'name', type: 'user' },
      { model: Answer, searchField: 'content', type: 'answer' },
      { model: Tag, searchField: 'name', type: 'tag' },
    ];

    const typeLower = type?.toLowerCase();
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // search everything
    } else {
      // search model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (modelInfo) {
        throw new Error('invalid search');
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === 'answer'
            ? `Answers Containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === 'user'
            ? item.clerkId
            : type === 'answer'
              ? item.question
              : item._id,
      }));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
