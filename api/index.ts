import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import express from 'express';
import cors from 'cors';
import typeDefs from '../src/graphql/schema';
import resolvers from '../src/graphql/resolvers';
import pageRouter from '../src/routes/pageRoutes';
import { authentication } from '../src/middleware/authMiddleware';

declare global {
	namespace Express {
		interface Request {
			client_id?: string;
		}
	}
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(pageRouter);
const httpServer = http.createServer(app);

const startApolloServer = async (
	app: express.Application,
	httpServer: http.Server
) => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		context: ({ req }) => {
			return { client_id: req.client_id };
		},
	});

	await server.start();
	app.use('/api', authentication);
	server.applyMiddleware({ app: app as any, path: '/api' });
};

startApolloServer(app, httpServer);

export default httpServer;
