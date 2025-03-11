import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import typeDefs from '../src/graphql/schema';
import resolvers from '../src/graphql/resolvers';
import pageRouter from '../src/routes/pageRoutes';
import { authentication } from '../src/middleware/authMiddleware';
import { rateLimit } from '../src/middleware/ratelimitMiddleware';

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
	app.use('/api', (req, res, next) => {
		// Only apply authentication middleware for non-GET requests
		if (req.method !== 'GET') {
			return rateLimit(req, res, () => authentication(req, res, next));
		} else {
			next();
		}
	});
	server.applyMiddleware({ app: app as any, path: '/api' });

	// Use 404 handler for all other routes
	app.use((req, res) => {
		res.status(404).sendFile(path.join(__dirname, '../src/public/404.html'));
	});
};

startApolloServer(app, httpServer);

export default httpServer;
