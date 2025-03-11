import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const redisUrl: string = process.env.UPSTASH_REDIS_REST_URL || '';
const redis = new Redis(redisUrl, {
	tls: {
		rejectUnauthorized: false,
	},
});

redis.on('connect', () => {
	console.log('Connected to Redis!');
});
redis.on('error', (err) => {
	console.error('Redis error:', err);
});

export default redis;
