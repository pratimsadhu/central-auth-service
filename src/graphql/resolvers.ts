import authService from '@services/auth';
import { verifyJwtToken, verifyAndGenerateToken } from '@utils/jwt';

const resolvers = {
	Query: {
		verifyToken: async (_: any, { token }: { token: string }) => {
			return verifyJwtToken(token);
		},
		generateRefreshToken: async (_: any, { token }: { token: string }) => {
			return verifyAndGenerateToken(token, 30 * 24 * 60 * 60);
		},
	},

	Mutation: {
		signUp: async (
			_: any,
			{
				email,
				password,
				client_id,
			}: { email: string; password: string; client_id: string }
		) => {
			return authService.signUp(email, password, client_id);
		},

		signIn: async (
			_: any,
			{
				email,
				password,
				client_id,
			}: { email: string; password: string; client_id: string }
		) => {
			return authService.signIn(email, password, client_id);
		},
	},
};

export default resolvers;
