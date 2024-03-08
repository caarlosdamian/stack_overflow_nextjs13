import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDataBase = async () => {
  mongoose.set('strictQuery', true);
  try {
    if (!process.env.MONGODB_URL) return console.log('MISSING MONGO DB URL');
    if (isConnected) {
      console.log('MongoDb is already connected');
    }
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        dbName: 'devFlow',
      });
      isConnected = true;
      console.log('MongoDb is connected');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
