import mongoose from 'mongoose';

import Category from './category';
import Enrollment from './enrollment';
import Event from './event';
import User from './user';

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
};

const models = { User, Category, Event, Enrollment };

export { connectDb };

export default models;