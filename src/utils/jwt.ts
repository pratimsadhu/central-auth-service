import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token with the given payload and expiration time
 * @param payload The payload to be signed in the JWT
 * @param expiresIn The time in seconds until the token expires
 * @returns The signed JWT token string
 */
export function generateJwtToken(payload: object, expiresIn: number): string {
	const secretKey = process.env.JWT_SECRET_KEY;
	if (!secretKey) {
		throw new Error('JWT Secret Key is not set!');
	}
	return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
}
