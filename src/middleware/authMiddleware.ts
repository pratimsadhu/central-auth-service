import clientService from '../services/client';
import { Response, NextFunction } from 'express';

/**
 * Middleware to authenticate requests by verifying the client ID.
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 * @returns void
 */
export const authentication = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const clientId = req.headers['x-client-id'] as string;
		if (!clientId) {
			res.status(401).json({
				error: 'Unauthorized Request',
				status: 401,
				message: 'Client ID is missing',
			});
			return;
		}

		const clientVerification = await clientService.verifyClient(clientId);
		if (clientVerification.error) {
			res.status(clientVerification.status).json(clientVerification);
			return;
		}

		if (clientVerification.status !== 200) {
			res.status(clientVerification.status).json({
				error: clientVerification.error,
				status: clientVerification.status,
				message: clientVerification.message,
			});
			return;
		}
		req.client_id = clientId;
		next();
	} catch (err) {
		console.error('Authentication middleware error:', err);
		res.status(500).json({
			error: 'Internal Server Error',
			status: 500,
			message: 'An unexpected error occurred during authentication',
		});
		return;
	}
};
