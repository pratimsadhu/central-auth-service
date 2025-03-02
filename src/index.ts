import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
const corsOptions = {
	origin: '*', // Allow all origins (modify as needed)
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};

const logger = morgan('dev');

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(logger);

app.get('/', (req, res) => {
	res.json({
		message: `Central Auth Service with Supabase is running in port!`,
	});
});

// Start Server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
