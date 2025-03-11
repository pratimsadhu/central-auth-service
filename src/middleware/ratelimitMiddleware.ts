import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 5; // 5 minutes
export const rateLimit = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ip =
		req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	const isBlocked = await redis.get(`blocked:${ip}`);
	if (isBlocked) {
		res.status(429).json({ error: 'Too many requests. Try again later.' });
		return;
	}

	const attempts = await redis.incr(`login_attempts:${ip}`);

	if (attempts === 1) {
		await redis.expire(`login_attempts:${ip}`, 60);
	}

	if (attempts > MAX_ATTEMPTS) {
		await redis.setex(`blocked:${ip}`, BLOCK_TIME, '1');
		res.status(429).json({ error: 'Too many requests. Try again later.' });
		return;
	}

	next();
};
