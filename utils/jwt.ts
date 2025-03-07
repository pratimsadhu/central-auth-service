import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Fetches the JWT secret or public key from the environment variables,
 * and verifies it is set (not undefined)
 * @param type The type of key to fetch ('JWT_PRIVATE_KEY' or 'JWT_PUBLIC_KEY')
 * @returns The requested JWT key as a string
 */
function getKeys(type: 'JWT_PRIVATE_KEY' | 'JWT_PUBLIC_KEY'): string {
	const key = process.env[type];

	if (!key || key.trim() === '') {
		throw new Error(`${type} is not set!`);
	}
	return key.replace(/\\n/g, '\n').trim();
}

/**
 * Generates a signed JWT token with the given payload and expiration time
 * @param payload The payload to be signed in the JWT
 * @param expiresIn The time in seconds until the token expires
 * @returns The signed JWT token string
 */
export function generateJwtToken(payload: object, expiresIn: number): string {
	const privateKey: string = getKeys('JWT_PRIVATE_KEY');
	return jwt.sign(payload, privateKey, {
		algorithm: 'RS256',
		expiresIn: expiresIn,
	});
}

/**
 * Generates an access token and a refresh token.
 * @param payload The payload to sign the tokens with.
 * @param accessTokenExpiresIn The expiration time of the access token. Default is 1 hour.
 * @param refreshTokenExpiresIn The expiration time of the refresh token. Default is 30 days.
 * @returns The access token and refresh token.
 */
export function generateTokens(
	payload: object,
	accessTokenExpiresIn: number = 60 * 60, // 1 hour
	refreshTokenExpiresIn: number = 30 * 24 * 60 * 60 // 30 days
): { access_token: string; refresh_token: string } {
	const access_token = generateJwtToken(payload, accessTokenExpiresIn);
	const refresh_token = generateJwtToken(payload, refreshTokenExpiresIn);

	return { access_token, refresh_token };
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token The JWT token to verify
 * @returns The decoded payload of the JWT token
 */
export function verifyJwtToken(token: string): JwtPayload {
	const publicKey: string = getKeys('JWT_PUBLIC_KEY');
	const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

	if (!decoded || typeof decoded !== 'object') {
		throw new Error('Invalid Token!');
	}

	return decoded as JwtPayload;
}

/**
 * Verifies a JWT token and generates a new token with the same payload
 * @param token The JWT to verify
 * @param expiresIn The expiration time of the new token
 * @returns The new JWT token
 */
export function verifyAndGenerateToken(
	token: string,
	expiresIn: number
): string {
	try {
		const decoded = verifyJwtToken(token);

		// Remove 'exp' field from decoded payload before generating a new token
		const { exp, iat, ...payloadWithoutExp } = decoded;
		return generateJwtToken(payloadWithoutExp, expiresIn);
	} catch (error) {
		throw new Error('Cannot refresh token, verification failed!');
	}
}
