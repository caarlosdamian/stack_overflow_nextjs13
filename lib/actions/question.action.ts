'use server';

import { connectToDataBase } from '../mongoose';

export const createquestion = async (params:any) => {
  try {
    await connectToDataBase();
  } catch (error) {}
};
