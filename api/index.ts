import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import express from 'express';
import cors from 'cors';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

const startApolloServer = async (
	app: express.Application,
	httpServer: http.Server
) => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();
	server.applyMiddleware({ app: app as any });
};

startApolloServer(app, httpServer);

export default httpServer;
