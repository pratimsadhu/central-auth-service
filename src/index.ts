import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import typeDefs from '@graphql/schema';
import resolvers from '@graphql/resolvers';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS setup
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json());

// Apollo Server Setup
const server = new ApolloServer({ typeDefs, resolvers, introspection: true });

async function startServer() {
	await server.start();
	server.applyMiddleware({ app: app as any, path: '/api' });
}

startServer().catch(console.error);

// Local development mode
if (process.env.NODE_ENV !== 'vercel') {
	const PORT = process.env.PORT || 8001;
	app.listen(PORT, () => {
		console.log(`🚀 Server running at http://localhost:${PORT}/api`);
	});
}

// Export handler for Vercel deployment
export default app;
