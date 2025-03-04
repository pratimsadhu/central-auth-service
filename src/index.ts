import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import { ApolloServer } from '@apollo/server';
import { ApolloServer } from 'apollo-server-express';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from '@graphql/schema';
import resolvers from '@graphql/resolvers';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
const corsOptions = {
	origin: '*', // TODO: Allow specific domains
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});

	await server.start();
	server.applyMiddleware({ app: app as any, path: '/api' });
	// app.use('/api', expressMiddleware(server));

	app.get('/', (req, res) => {
		res.json({
			message: `Central Auth Service with Supabase is running in port!`,
		});
	});

	// Start Server
	app.listen(PORT, () => {
		console.log(`Server running at http://localhost:${PORT}`);
		console.log(`GraphQL API available at http://localhost:${PORT}/api`);
	});
}

startApolloServer().catch((err) =>
	console.error('Failed to start server:', err)
);
