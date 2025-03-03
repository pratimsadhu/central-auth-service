import { hashPassword, verifyPassword } from '@utils/argon';

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

	test('should throw an error for an incorrect password', async () => {
		const hashedPassword = await hashPassword(password);

		try {
			await verifyPassword('wrong_password', hashedPassword);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe('Error verifying password!');
		}
	});
});
