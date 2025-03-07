import argon2, { Options } from 'argon2';

/**
 * Configuration for Argon2 hashing
 */
const argon2Config: Options = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16,
	timeCost: 3,
	parallelism: 1,
	hashLength: 64,
};

export default argon2Config;
