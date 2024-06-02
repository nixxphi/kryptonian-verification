import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let retries = 0;
const MAX_RETRIES = 3;

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    retry_strategy: (options) => {
        if (retries >= MAX_RETRIES) {
            console.error('Max retries reached, not attempting to reconnect');
            return new Error('Max retries reached');
        }

        retries += 1;
        console.log(`Redis reconnecting: attempt ${retries}, delay ${options.attempt * 1000}ms`);
        return options.attempt * 1000;
    }
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
    retries = 0; 
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err.message, err.stack);
});

export default redisClient;
