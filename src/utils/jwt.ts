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
export function verifyJwtToken(token: string): JwtPayload {
	const secretKey: string = getSecretKey();
	const decoded = jwt.verify(token, secretKey);

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
