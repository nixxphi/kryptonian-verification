import express from 'express';
import bodyParser from 'body-parser';
import redisClient from './configs/redis.config.js';
import cors from 'cors';
import morgan from 'morgan';
import mainRouter from './routes/main.route.js';
import connectDB from './configs/mongoose.config.js';

const app = express();
const port = process.env.PORT || 6900;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Routes setup
app.use('/api/v1', mainRouter);

// Connect to MongoDB
connectDB();

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

// Start
app.listen(port, () => {
  console.log(`Server active on port ${port}`);
});
