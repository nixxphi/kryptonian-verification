import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import router from './routes/main.route.js’;
import redis from 'redis';
import cors from 'cors'
import morgan from 'morgan'

const app = express();
const port = process.env.PORT || 6900;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(dev));
app.use(cors);

// Routes setup
app.use('/api/v1', router);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Connect to Redis
const redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
