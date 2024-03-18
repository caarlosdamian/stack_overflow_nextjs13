'use server';

import Question from '@/database/question.model';
import { connectToDataBase } from '../mongoose';
import Tag from '@/database/tag.model';
import { CreateQuestionParams, GetQuestionsParams } from './shared.types';
import User from '@/database/user.model';

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectToDataBase();
    const questions = await Question.find({})
      .populate({
        path: 'tags',
        model: Tag,
      })
      .populate({ path: 'author', model: User });
    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createquestion = async (params: CreateQuestionParams) => {
  try {
    await connectToDataBase();
    const { title, content, tags, author } = params;
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // create the tag or get them
    for (const tag of tags) {
      try {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
          { $setOnInsert: { name: tag }, $push: { question: 84389439834 } },
          { upsert: true, new: true }
        );
        tagDocuments.push(existingTag);
      } catch (error) {
        console.log('Errror', error);
      }
    }

    // update question

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create interation record
    // increment authors reputation
  } catch (error) {}
};
