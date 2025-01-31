import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://admin:admin@localhost:27017/Scheduler?authSource=admin';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as any);
        console.log('conn established');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};