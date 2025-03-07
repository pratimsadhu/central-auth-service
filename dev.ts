import app from './api/index';
import consola from 'consola';
import dotenv from 'dotenv';
dotenv.config();

// For local development
app.listen(3000, () => consola.info('Server started on http://localhost:3000'));
