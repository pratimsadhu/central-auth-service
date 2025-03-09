import supabaseClient from '../config/supabase';
import { generateTokens, verifyJwtToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/argon';
import clientService from './client';

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
			// Verify the client.
			const clientVerification = await clientService.verifyClient(clientId);
			if (clientVerification.error) return clientVerification;

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

			const { data: user, error } = await supabaseClient
				.from('users')
				.insert([
					{ email: email, password: hashedPassword, client_id: clientId },
				])
				.select('*')
				.maybeSingle();

			if (error) {
				console.error('Signup Error:', error);
				throw new Error(error.message || 'Error inserting user into database.');
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
			// Verify the client.
			const clientVerification = await clientService.verifyClient(clientId);
			if (clientVerification.error) return clientVerification;

			// Fetch user with matching email and client_id.
			const { data: user, error } = await supabaseClient
				.from('users')
				.select('*')
				.eq('email', email)
				.eq('client_id', clientId)
				.maybeSingle();

			if (error) {
				console.error('Signin Error:', error);
				throw new Error(error.message || 'Error signing in.');
			}

			if (!user) {
				return { error: 'User not found', status: 404 };
			}

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
	 * @param token The token to verify the user with.
	 * @param updatedData The data to update the user with.
	 * @returns The token, refresh token, message, and status code.
	 */
	update: async (
		userId: string,
		clientId: string,
		token: string,
		updatedData: { email?: string; password?: string }
	) => {
		try {
			// Verify the token.
			const decodedToken = verifyJwtToken(token);
			if (
				decodedToken.user_id !== userId ||
				decodedToken.client_id !== clientId
			) {
				return { error: 'Unauthorized Request', status: 403 };
			}

			// Verify the client.
			const clientVerification = await clientService.verifyClient(clientId);
			if (clientVerification.error) return clientVerification;

			// Fetch user with matching id and client_id.
			const { data, error } = await supabaseClient
				.from('users')
				.select('*')
				.eq('id', userId)
				.eq('client_id', clientId)
				.maybeSingle();

			if (error) throw new Error(error.message);
			if (!data) return { error: 'User not found', status: 404 };

			// Prepare the updated data
			const updateFields: { email?: string; password?: string } = {};
			if (updatedData.email) {
				updateFields.email = updatedData.email;
			}
			if (updatedData.password) {
				updateFields.password = await hashPassword(updatedData.password);
			}

			// Update user record
			const { error: updateError } = await supabaseClient
				.from('users')
				.update(updateFields)
				.eq('id', userId);

			if (updateError) throw new Error(updateError.message);
			const payload = {
				user_id: userId,
				email: updatedData.email || data.email,
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

	/**
	 * Deletes a user.
	 * @param userId The ID of the user to delete.
	 * @param clientId The unique ID of the website the user is deleting for.
	 * @param token The token to verify the user with.
	 * @returns The message and status code.
	 */
	delete: async (userId: string, clientId: string, token: string) => {
		try {
			// Verify the token.
			const decodedToken = verifyJwtToken(token);
			if (
				decodedToken.user_id !== userId ||
				decodedToken.client_id !== clientId
			) {
				return { error: 'Unauthorized Request', status: 403 };
			}

			// Verify the client.
			const clientVerification = await clientService.verifyClient(clientId);
			if (clientVerification.error) return clientVerification;

			// Fetch user to ensure they exist before deleting
			const { data: existingUser, error: findError } = await supabaseClient
				.from('users')
				.select('id')
				.eq('id', userId)
				.eq('client_id', clientId)
				.maybeSingle();

			if (findError) throw new Error(findError.message);
			if (!existingUser) return { error: 'User not found', status: 404 };

			// Delete the user from the database
			const { error: deleteError } = await supabaseClient
				.from('users')
				.delete()
				.eq('id', userId);

			if (deleteError) throw new Error(deleteError.message);

			return {
				message: 'User deleted successfully',
				status: 200,
				action: 'Logout and clear tokens from browser',
			};
		} catch (error) {
			console.log('Error deleting user:', error);
			return { error: 'Something went wrong. Please try again.', status: 500 };
		}
	},
};

export default authService;
