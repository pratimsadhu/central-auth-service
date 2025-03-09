import supabaseClient from '../config/supabase';

const clientService = {
	/**
	 * Verifies a client ID.
	 * @param clientId The client ID to verify.
	 * @returns A message if the client is verified, or an error message if not.
	 */
	verifyClient: async (clientId: string) => {
		try {
			const { data, error } = await supabaseClient
				.from('clients')
				.select('id')
				.eq('id', clientId);

			if (error) throw new Error(error.message);
			if (!data) {
				return { error: 'Client not found.', status: 404 };
			}

			return { message: 'Client verified.', status: 200 };
		} catch (error) {
			console.error('Client Verification Error:', error);
			return { error: 'Something went wrong. Please try again.', status: 500 };
		}
	},
};

export default clientService;
