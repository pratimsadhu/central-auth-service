import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '@graphql/schema';
import resolvers from '@graphql/resolvers';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS setup
const corsOptions = {
	origin: '*', // TODO: Restrict to allowed domains in production
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(express.json());
app.use(cors(corsOptions));

// Function to initialize Apollo Server
async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});

	await server.start();
	server.applyMiddleware({ app: app as any, path: '/api' });
}

// Start Apollo Server asynchronously
startApolloServer().catch((err) => {
	console.error('Failed to start server:', err);
});

// Health Check Route
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Central Auth Service is running!' });
});

// Export the handler for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
	return app(req, res);
}
