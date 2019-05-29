import mongoose from 'mongoose';
import Redis from 'ioredis';

import Category from './category';
import Event from './event';
import User from './user';

const redisClient = new Redis(`redis://${process.env.REDIS_DATABASE_HOST}:${process.env.REDIS_DATABASE_PORT}/0`);

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL);
};

export { connectDb, redisClient, User, Category, Event };