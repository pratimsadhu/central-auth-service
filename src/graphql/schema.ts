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

	type Query {
		verifyToken(token: String!): User
	}

	type Mutation {
		signUp(email: String!, password: String!): AuthPayload!
		signIn(email: String!, password: String!): AuthPayload!
	}
`;

export default typeDefs;
