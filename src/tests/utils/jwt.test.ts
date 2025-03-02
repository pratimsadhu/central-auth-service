import {
	generateJwtToken,
	verifyJwtToken,
	verifyAndGenerateToken,
} from '@utils/jwt';

describe('JWT Authentication', () => {
	const mockPayload = { userId: 1, name: 'John Doe' };
	const expiresIn = 3600;

	beforeEach(() => {
		jest.resetModules();
		process.env.JWT_SECRET_KEY = 'test_secret';
	});

	// Indirectly test the getSecretKey function
	test('should throw an error if JWT_SECRET_KEY is not set', () => {
		delete process.env.JWT_SECRET_KEY;

		// Reload module to reflect the environment change
		const jwtUtils = require('@utils/jwt');

		expect(() => jwtUtils.generateJwtToken(mockPayload, expiresIn)).toThrow(
			'JWT Secret Key is not set!'
		);
	});

	test('should generate a valid JWT token', () => {
		const token = generateJwtToken(mockPayload, expiresIn);

		expect(token).toBeDefined();
		expect(typeof token).toBe('string');
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
