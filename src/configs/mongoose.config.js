import mongoose from 'mongoose';
import { MONGODB_URI, DB_NAME as dbName } from './env.config.js';

export default (function database() {
  const startdb = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(MONGODB_URI, {})
      .then(() => {
        console.log('Successfully connected to the database...');
      })
      .catch((err) => {
        console.error('There was an error connecting to zha database:', err.message);
        console.log('Reconnecting to database...');
        startdb();
      });
  };

  startdb();
});