'use server';

import Question from '@/database/question.model';
import Tag, { ITag } from '@/database/tag.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import { FilterQuery, ObjectId } from 'mongoose';

export async function getQuestions(params: GetQuestionsParams) {
  const { filter, page = 1, pageSize = 10, searchQuery } = params;
  try {
    connectToDatabase();

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case 'frequent':
        sortOptions = { views: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;

      default:
        break;
    }

    const questionsToSkip = (page - 1) * pageSize;
    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .skip(questionsToSkip)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > questionsToSkip + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    await Interaction.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments,
    });

    await User.findOneAndUpdate(question.author, {
      $inc: { reputation: 5 },
    });

    revalidatePath(path);
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name username picture',
      })
      .populate({
        path: 'tags',
        model: Tag,
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion({
  hasdownVoted,
  hasupVoted,
  path,
  questionId,
  userId,
}: QuestionVoteParams) {
  try {
    connectToDatabase();
    let updateQuery: any = {};
    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) throw new Error('Question not found');
    if (JSON.stringify(question.author) !== JSON.stringify(userId)) {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { reputation: hasupVoted ? -1 : 1 },
        }
      );
      await User.findOneAndUpdate(question.author, {
        $inc: { reputation: 10 },
      });
    }
    // Increment authors reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function donwvoteQuestion({
  hasdownVoted,
  hasupVoted,
  path,
  questionId,
  userId,
}: QuestionVoteParams) {
  try {
    connectToDatabase();
    let updateQuery: any = {};
    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) throw new Error('Question not found');
    // Increment authors reputation

    if (JSON.stringify(question.author) !== JSON.stringify(userId)) {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { reputation: -1 },
        }
      );
      await User.findOneAndUpdate(question.author, {
        $inc: { reputation: -2 },
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion({
  path,
  questionId,
}: DeleteQuestionParams) {
  try {
    connectToDatabase();
    // const question = await Question.findOneAndDelete({
    //   _id: questionId,
    // });
    // if (!question) throw new Error('No Question found');
    // question.tags.forEach(async (element: ObjectId) => {
    //   const tag = await Tag.findOne(element);
    //   tag.questions.remove(question._id);
    //   tag.save();
    // });
    // if (question.answers.length !== 0) {
    //   question.answers.forEach(async (element: ObjectId) => {
    //     await Answer.findOneAndDelete(element);
    //   });
    // }
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      {
        $pull: { questions: questionId },
      }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion({
  content,
  path,
  questionId,
  tags,
  title,
}: EditQuestionParams) {
  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        content,
        title,
      },
      { new: true }
    ).populate({
      path: 'tags',
      model: Tag,
    });

    const actualTags = question.tags.map((item: ITag) => item.name);
    const removedTags = question.tags
      .filter((item: ITag) => !tags.includes(item.name))
      .map((element: ITag) => element._id);

    const newtags = tags.filter((item) => !actualTags.includes(item));

    if (removedTags.length !== 0) {
      await Question.findByIdAndUpdate(question._id, {
        $pullAll: { tags: removedTags },
      });
      removedTags.forEach(async (element: ObjectId) => {
        await Tag.findByIdAndUpdate(element, {
          $pull: { questions: questionId },
        });
      });
    }

    if (newtags.length !== 0) {
      const tagDocuments = [];
      for (const tag of newtags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
          { $setOnInsert: { name: tag }, $push: { questions: question._id } },
          { upsert: true, new: true }
        );

        tagDocuments.push(existingTag._id);
      }

      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } },
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();
    const questions = await Question.find()
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);
    return questions;
  } catch (error) {
    console.log(error);
  }
}


export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}