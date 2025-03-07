import { hashPassword, verifyPassword } from '../../src/utils/argon';

describe('Argon2 Password Hashing', () => {
	const password = 'password123';

	test('should hash a password', async () => {
		const hashedPassword = await hashPassword(password);

		expect(hashedPassword).toBeDefined();
		expect(typeof hashedPassword).toBe('string');
	});

	test('should verify a password', async () => {
		const hashedPassword = await hashPassword(password);
		const isPasswordValid = await verifyPassword(hashedPassword, password);

		expect(isPasswordValid).toBe(true);
	});

	test('should return false for an incorrect password', async () => {
		const hashedPassword = await hashPassword(password);
		const isPasswordValid = await verifyPassword(
			hashedPassword,
			'incorrect_password'
		);

		expect(isPasswordValid).toBe(false);
	});
});
