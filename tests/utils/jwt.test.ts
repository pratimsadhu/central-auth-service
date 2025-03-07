import {
	generateJwtToken,
	generateTokens,
	verifyJwtToken,
	verifyAndGenerateToken,
} from '../../src/utils/jwt';

describe('JWT Authentication', () => {
	const mockPayload = { userId: 1, name: 'John Doe' };
	const expiresIn = 3600;

	test('should generate a valid JWT token', () => {
		const token = generateJwtToken(mockPayload, expiresIn);

		expect(token).toBeDefined();
		expect(typeof token).toBe('string');
	});

	test('should generate an access token and a refresh token', () => {
		const { access_token, refresh_token } = generateTokens(mockPayload);

		expect(access_token).toBeDefined();
		expect(refresh_token).toBeDefined();
		expect(typeof access_token).toBe('string');
		expect(typeof refresh_token).toBe('string');
	});

	test('should generate an access token and a refresh token with custom expiration times', () => {
		const { access_token, refresh_token } = generateTokens(
			mockPayload,
			60,
			3600
		);

		const decodedAccessToken = verifyJwtToken(access_token);
		const decodedRefreshToken = verifyJwtToken(refresh_token);
		const accessExp = decodedAccessToken.exp;
		const refreshExp = decodedRefreshToken.exp;

		expect(decodedAccessToken).toHaveProperty('userId', 1);
		expect(decodedRefreshToken).toHaveProperty('userId', 1);

		expect(accessExp).toBeDefined();
		expect(refreshExp).toBeDefined();

		if (accessExp && refreshExp) {
			expect(accessExp).toBeLessThan(refreshExp);
		}
	});

	test('should verify a valid JWT token', () => {
		const token = generateJwtToken(mockPayload, expiresIn);
		const decoded = verifyJwtToken(token);

		expect(decoded).toHaveProperty('userId', 1);
		expect(decoded).toHaveProperty('name', 'John Doe');
	});

	test('should throw an error for an invalid JWT token', () => {
		expect(() => verifyJwtToken('invalid_token')).toThrow();
	});

	test('should throw an error when verifying a malformed token', () => {
		const malformedToken = 'abc.def.ghi';
		expect(() => verifyJwtToken(malformedToken)).toThrow();
	});

	test('should generate a new JWT token, given a valid JWT token', () => {
		const oldToken = generateJwtToken(mockPayload, expiresIn);
		const newToken = verifyAndGenerateToken(oldToken, expiresIn);
		const decoded = verifyJwtToken(newToken);

		expect(newToken).toBeDefined();
		expect(typeof newToken).toBe('string');
		expect(decoded).toHaveProperty('userId', 1);
	});

	test('should throw an error when trying to refresh an invalid token', () => {
		expect(() => verifyAndGenerateToken('invalid_token', expiresIn)).toThrow(
			'Cannot refresh token, verification failed!'
		);
	});

	test('should fail to verify an expired token', async () => {
		const shortLivedToken = generateJwtToken(mockPayload, 1);
		await new Promise((resolve) => setTimeout(resolve, 2000));

		expect(() => verifyJwtToken(shortLivedToken)).toThrow();
	});
});
