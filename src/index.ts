import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import typeDefs from '@graphql/schema';
import resolvers from '@graphql/resolvers';
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
});

const startServer = server.start().then(() => {
	server.applyMiddleware({ app: app as any, path: '/api' });
});

export default async (req: VercelRequest, res: VercelResponse) => {
	await startServer;
	return app(req, res);
};
