import twilio from 'twilio';
import { Request, Response, NextFunction } from 'express';

/**
 *
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*} 
 */
export function validateTwilioRequest(req: Request, res: Response, next: NextFunction) {
    // Read env vars at request time so dotenv is guaranteed to have loaded
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN ?? '';
    const twilioSignature = req.headers['x-twilio-signature'] as string;
    // Twilio signs the exact public URL it called; req.originalUrl already starts with '/'
    const url = process.env.BASE_URL + req.originalUrl;

    if (!twilio.validateRequest(twilioAuthToken, twilioSignature, url, req.body)) {
        console.error('Failed Twilio request validation');
        return res.status(401).send('Invalid request signature.');
    }
    next();
}