import { get } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Fetches the JWT secret key from the environment variables,
 * and verifies it is set (not undefined)
 * @returns The JWT secret key
 */
function getSecretKey(): string {
	const secretKey = process.env.JWT_SECRET_KEY;

	if (!secretKey) {
		throw new Error('JWT Secret Key is not set!');
	}
	return secretKey;
}

/**
 * Generates a signed JWT token with the given payload and expiration time
 * @param payload The payload to be signed in the JWT
 * @param expiresIn The time in seconds until the token expires
 * @returns The signed JWT token string
 */
export function generateJwtToken(payload: object, expiresIn: number): string {
	const secretKey: string = getSecretKey();
	return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token The JWT token to verify
 * @returns The decoded payload of the JWT token
 */
export function verifyJwtToken(token: string): JwtPayload | string {
	const secretKey: string = getSecretKey();
	return jwt.verify(token, secretKey);
}
