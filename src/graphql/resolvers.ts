import authService from '../services/auth';
import {
	verifyJwtToken,
	verifyAndGenerateToken,
	generateJwtToken,
} from '../utils/jwt';

const resolvers = {
	Query: {
		verifyToken: async (_: any, { token }: { token: string }) => {
			return verifyJwtToken(token);
		},
		generateRefreshToken: async (_: any, { token }: { token: string }) => {
			return verifyAndGenerateToken(token, 30 * 24 * 60 * 60);
		},
		generateToken: () => {
			return generateJwtToken({ id: '1', email: 'abc@example.com' }, 60 * 60);
		},
		sayHello: () => {
			return {
				message: 'Hello, World!',
				status: 200,
			};
		},
	},

	Mutation: {
		signUp: async (
			_: any,
			{ email, password }: { email: string; password: string },
			context: { client_id: string }
		) => {
			return authService.signUp(email, password, context.client_id);
		},

		signIn: async (
			_: any,
			{ email, password }: { email: string; password: string },
			context: { client_id: string }
		) => {
			return authService.signIn(email, password, context.client_id);
		},

		updateUser: async (
			_: any,
			{
				user_id,
				token,
				updated_data,
			}: {
				user_id: string;
				token: string;
				updated_data: { email?: string; password?: string };
			},
			context: { client_id: string }
		) => {
			return authService.update(
				user_id,
				context.client_id,
				token,
				updated_data
			);
		},

		deleteUser: async (
			_: any,
			{ user_id, token }: { user_id: string; token: string },
			context: { client_id: string }
		) => {
			return authService.delete(user_id, context.client_id, token);
		},
	},
};

export default resolvers;
