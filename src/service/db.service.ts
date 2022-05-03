import mongoose from 'mongoose';

const url: string | undefined = process.env.MONGO_URL;

/**
 * @function connectDatabase
 * @description This is an async function that allows you to connect to the database
 */
export default async function connectDatabase(): Promise<void> {
  try {
    if (!url)
      throw new Error('MONGO_URL is not defined');
    console.debug('- MongoDb connecting to', url);
    await mongoose.connect(url);
    console.debug('- MongoDb connected ...');
  } catch (err: any) {
    console.error(err.message);
    //Exit the process with a failure if it cannot connect to the database
    process.exit(1);
  }
}
