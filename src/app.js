import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import redisClient from './configs/redis.config.js';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/main.route.js';

const app = express();
const port = process.env.PORT || 6900;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev')); 

// Routes setup
app.use('/api/v1', router);

// Function to connect to MongoDB with retries
const connectToMongoDB = async () => {
    let retries = 5;
    while (retries) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected');
            break; 
        } catch (err) {
            console.error('MongoDB connection error:', err);
            retries--;
            if (retries === 0) {
                console.error('Failed to connect to MongoDB after multiple retries. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying MongoDB connection in 3 secs (${retries} retries left)`);
            await new Promise((resolve) => setTimeout(resolve, 3000)); 
        }
    }
};

// Connect to MongoDB with retries
connectToMongoDB();

// Connect to Redis
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
