import express from 'express';
import path from 'path';

const router = express.Router();

// Static files from src/public
router.use(express.static(path.join(__dirname, '../public')));

// Homepage route
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/home.html'));
});

// API documentation route
router.get('/api-documentation', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/api-docs.html'));
});

// API route
router.get('/api', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/api.html'));
});

export default router;
