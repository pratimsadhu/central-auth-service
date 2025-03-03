import supabaseClient from '@config/supabase';
import { generateJwtToken } from '@utils/jwt';
import { hashPassword, verifyPassword } from '@utils/argon';

const authService = {
	/**
	 * Signs up a user
	 * @param email The email of the user to sign up
	 * @param password The password of the user to sign up
	 * @param clientId The unique ID of website the user is signing up for
	 * @returns An object containing a message and status code
	 */
	signUp: async (email: string, password: string, clientId: string) => {
		try {
			const hashedPassword = await hashPassword(password);
			const { error } = await supabaseClient.from('users').upsert({
				email: email,
				password: hashedPassword,
				client_id: clientId,
			});

			if (error) {
				throw new Error(error.message);
			}

			return { message: 'Sign up successful', status: 200 };
		} catch (error: any) {
			return { error: error.message || 'Internal Server Error', status: 500 };
		}
	},

	/**
	 * Signs in a user
	 * @param email The email of the user to sign in
	 * @param password The password of the user to sign in
	 * @param clientId The unique ID of website the user is signing in for
	 * @returns The token, refresh token, message, and status code
	 */
	signIn: async (email: string, password: string, clientId: string) => {
		try {
			const { data, error } = await supabaseClient
				.from('users')
				.select('*')
				.eq('email', email)
				.eq('client_id', clientId);

			if (error) {
				throw new Error(error.message);
			}

			if (!data || data.length === 0) {
				return { error: 'User not found', status: 404 };
			}

			const user = data[0];
			const isPasswordValid = await verifyPassword(user.password, password);

			if (!isPasswordValid) {
				return { error: 'Invalid password', status: 401 };
			}

			const payload = {
				user_id: user.id,
				email: email,
				client_id: clientId,
			};

			const token = generateJwtToken(payload, 60 * 60);
			const refreshToken = generateJwtToken(
				{ ...payload, access_token: token },
				30 * 24 * 60 * 60
			);

			return {
				token,
				refreshToken,
				message: 'Sign in successful',
				status: 200,
			};
		} catch (error: any) {
			return { error: error.message || 'Internal Server Error', status: 500 };
		}
	},
};

export default authService;
