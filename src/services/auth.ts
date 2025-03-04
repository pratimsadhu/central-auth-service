import supabaseClient from '@config/supabase';
import { generateJwtToken } from '@utils/jwt';
import { hashPassword, verifyPassword } from '@utils/argon';

/**
 * Generates an access token and a refresh token.
 * @param payload The payload to sign the tokens with.
 * @returns The access token and refresh token.
 */
function generateTokens(payload: object) {
	const access_token = generateJwtToken(payload, 60 * 60); // 1 hour
	const refresh_token = generateJwtToken(payload, 30 * 24 * 60 * 60); // 30 days

	return { access_token, refresh_token };
}

/**
 * The authentication service.
 */
const authService = {
	/**
	 * Signs up a user ensuring unique (email, clientId) pairs.
	 * @param email The email of the user to sign up.
	 * @param password The password of the user to sign up.
	 * @param clientId The unique ID of the website the user is signing up for.
	 * @returns An object containing a message and status code.
	 */
	signUp: async (email: string, password: string, clientId: string) => {
		try {
			// Check if the user with this email & clientId already exists.
			const { data: existingUser, error: findError } = await supabaseClient
				.from('users')
				.select('id')
				.eq('email', email)
				.eq('client_id', clientId)
				.maybeSingle();

			if (findError) throw new Error(findError.message);

			// If user exists, return error.
			if (existingUser) {
				return {
					error: 'User with this email already exists for this client.',
					status: 409,
				};
			}

			// Hash the password before storing.
			const hashedPassword = await hashPassword(password);

			const { data, error } = await supabaseClient
				.from('users')
				.insert([
					{ email: email, password: hashedPassword, client_id: clientId },
				])
				.select('*')
				.single();

			if (error) throw new Error(error.message);

			const user = data;
			const payload = {
				user_id: user.id,
				email: email,
				client_id: clientId,
			};

			const { access_token, refresh_token } = generateTokens(payload);

			return {
				access_token,
				refresh_token,
				message: 'Sign up successful',
				status: 201,
			};
		} catch (error: any) {
			console.error('Sign-up Error:', error);
			return { error: 'Something went wrong. Please try again.', status: 500 };
		}
	},

	/**
	 * Signs in a user.
	 * @param email The email of the user to sign in.
	 * @param password The password of the user to sign in.
	 * @param clientId The unique ID of the website the user is signing in for.
	 * @returns The token, refresh token, message, and status code.
	 */
	signIn: async (email: string, password: string, clientId: string) => {
		try {
			// Fetch user with matching email and client_id.
			const { data, error } = await supabaseClient
				.from('users')
				.select('*')
				.eq('email', email)
				.eq('client_id', clientId)
				.maybeSingle();

			if (error) throw new Error(error.message);

			if (!data) {
				return { error: 'User not found', status: 404 };
			}

			const user = data;
			const isPasswordValid = await verifyPassword(user.password, password);

			if (!isPasswordValid) {
				return { error: 'Invalid password', status: 401 };
			}

			const payload = {
				user_id: user.id,
				email: email,
				client_id: clientId,
			};

			const { access_token, refresh_token } = generateTokens(payload);

			return {
				access_token,
				refresh_token,
				message: 'Sign in successful',
				status: 200,
			};
		} catch (error: any) {
			console.error('Sign-in Error:', error);
			return { error: 'Something went wrong. Please try again.', status: 500 };
		}
	},

	/**
	 * Updates a user.
	 * @param userId The ID of the user to update.
	 * @param clientId The unique ID of the website the user is updating for.
	 * @param updatedData The data to update the user with.
	 * @returns The token, refresh token, message, and status code.
	 */
	update: async (
		userId: string,
		clientId: string,
		updatedData: { email: string; password: string }
	) => {
		try {
			const { data, error } = await supabaseClient
				.from('users')
				.select('*')
				.eq('id', userId)
				.eq('client_id', clientId)
				.maybeSingle();

			if (error) throw new Error(error.message);

			if (!data) {
				return { error: 'User not found', status: 404 };
			}

			const { email, password } = updatedData;
			const hashedPassword = await hashPassword(password);

			const { error: updateError } = await supabaseClient
				.from('users')
				.update({ email: email, password: hashedPassword })
				.eq('id', userId)
				.maybeSingle();

			if (updateError) throw new Error(updateError.message);

			const user = data;
			const payload = {
				user_id: user.id,
				email: email,
				client_id: clientId,
			};

			const { access_token, refresh_token } = generateTokens(payload);

			return {
				access_token,
				refresh_token,
				message: 'User updated successfully',
				status: 200,
			};
		} catch (error) {
			console.log('Error updating user:', error);
			return { error: 'Something went wrong. Please try again.', status: 500 };
		}
	},
};

export default authService;
