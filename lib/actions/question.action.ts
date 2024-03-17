'use server';

import Question from '@/database/question.model';
import { connectToDataBase } from '../mongoose';
import Tag from '@/database/tag.model';

export const createquestion = async (params: any) => {
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
