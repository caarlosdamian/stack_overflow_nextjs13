'use server';

import Answer from '@/database/answer.model';
import { SearchParams } from './shared.types';
import { connectToDatabase } from '../mongoose';
import User from '@/database/user.model';
import Question from '@/database/question.model';
import { getAnswers } from './answer.action';
import { getQuestions } from './question.action';
import { getAllUsers } from './user.action';
import { getAllTags } from './tag.action';

export async function getResultFilter({ query, type }: SearchParams) {
  try {
    console.log('query', query);
    connectToDatabase();
    let result: any[] = [];

    const getAll = async () => {
      const questions = await getQuestions({ pageSize: 2, searchQuery: query });
      const answers = await getAllUsers({ pageSize: 2, searchQuery: query });
      return [...answers, ...questions];
    };

    switch (type) {
      case 'question':
        result = await getQuestions({ pageSize: 2, searchQuery: query });
        break;
      case 'answer':
        // result = await getAnswers({ pageSize: 2, searchQuery: query });
        break;
      case 'user':
        result = await getAllUsers({ pageSize: 2, searchQuery: query });
        break;
      case 'tag':
        result = await getAllTags({ pageSize: 2, searchQuery: query });
        break;
      default:
        result = await getAll();
        break;
    }

    console.log('++++====resultado:', result);

    return result;
  } catch (error) {}
}
