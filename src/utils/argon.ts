import argon2 from 'argon2';
import argon2Config from '../config/argon';

/**
 * Hashes a plain text password using Argon2
 * @param password The plain text password to hash
 * @returns The hashed password as a string
 */
export async function hashPassword(password: string): Promise<string> {
	try {
		const hashedPassword = await argon2.hash(password, argon2Config);
		return hashedPassword;
	} catch (error) {
		throw new Error('Error hashing password');
	}
}

/**
 * Verifies a plain text password against a hashed password
 * @param hashedPassword The hashed password
 * @param password The plain text password
 * @returns A boolean indicating whether the password is valid
 */
export async function verifyPassword(
	hashedPassword: string,
	password: string
): Promise<boolean> {
	try {
		return await argon2.verify(hashedPassword, password);
	} catch (error) {
		console.error('Password verification error:', error);
		return false;
	}
}
