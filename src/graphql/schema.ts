import { gql } from 'apollo-server-express';

const typeDefs = gql`
	type User {
		id: ID!
		email: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	input UserUpdateInput {
		email: String
		password: String
	}

	type Query {
		verifyToken(token: String!): User
		generateRefreshToken(token: String!): String
	}

	type Mutation {
		signUp(email: String!, password: String!, client_id: String!): AuthPayload!
		signIn(email: String!, password: String!, client_id: String!): AuthPayload!
		updateUser(
			user_id: String!
			client_id: String!
			token: String!
			updated_data: UserUpdateInput!
		): AuthPayload!
		deleteUser(user_id: String!, client_id: String!, token: String!): Boolean!
	}
`;

export default typeDefs;
