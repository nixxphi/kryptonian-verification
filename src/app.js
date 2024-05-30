import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import redisClient from './configs/redis.config.js';
import cors from 'cors'
import morgan from 'morgan'
import router from './routes/main.route.js';

const dev = morgan.dev
const app = express();
const port = process.env.PORT || 6900;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(dev);
app.use(cors);

// Routes setup
app.use('/api/v1', router);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Connect to Redis
redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
