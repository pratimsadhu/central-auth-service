import supabaseClient from '@config/supabase';
import { hashPassword } from '@utils/argon';

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
			const hashedPassword = hashPassword(password);
			const { error } = await supabaseClient.from('users').upsert({
				email: email,
				password: hashedPassword,
				client_id: clientId,
			});

			if (error) {
				throw new Error(error.message);
			}

			return { message: 'Sign up successful', status: 200 };
		} catch (error) {
			return { error: error, status: 500 };
		}
	},
	signIn: async (email: string, password: string, clientId: string) => {},
};

export default authService;
