import { gql } from 'apollo-server-express';

const typeDefs = gql`
	type User {
		id: String!
		email: String!
	}

	type AuthPayload {
		access_token: String
		refresh_token: String
		message: String
		status: Int!
		error: String
	}

	type HelloResponse {
		message: String!
		status: Int!
	}

	input UserUpdateInput {
		email: String
		password: String
	}

	type Query {
		verifyToken(token: String!): User
		generateRefreshToken(token: String!): String
		generateToken: String
		sayHello: HelloResponse
	}

	type Mutation {
		signUp(email: String!, password: String!): AuthPayload!
		signIn(email: String!, password: String!): AuthPayload!
		updateUser(
			user_id: String!
			token: String!
			updated_data: UserUpdateInput!
		): AuthPayload!
		deleteUser(user_id: String!, token: String!): Boolean!
	}
`;

export default typeDefs;
