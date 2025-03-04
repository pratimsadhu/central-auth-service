import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
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
app.use(helmet());
app.use(morgan('dev'));

async function startApolloServer() {
	const server = new ApolloServer({ typeDefs, resolvers });

	await server.start();
	server.applyMiddleware({ app } as any);

	app.get('/', (req, res) => {
		res.json({
			message: `Central Auth Service with Supabase is running in port!`,
		});
	});

	// Start Server
	app.listen(PORT, () => {
		console.log(`Server running at http://localhost:${PORT}`);
		console.log(
			`GraphQL endpoint available at http://localhost:${PORT}${server.graphqlPath}`
		);
	});
}

startApolloServer().catch((err) =>
	console.error('Failed to start server:', err)
);
