import argon2 from 'argon2';

/**
 * Hashes a plain text password using Argon2
 * @param password The plain text password to hash
 * @returns The hashed password as a string
 */
export async function hashPassword(password: string): Promise<string> {
	try {
		const hashedPassword = await argon2.hash(password);
		return hashedPassword;
	} catch (error) {
		throw new Error('Error hashing password');
	}
}
