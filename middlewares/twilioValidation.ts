import twilio from 'twilio';
import { Request, Response, NextFunction } from 'express';

const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN : ''; 

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
    const twilioSignature = req.headers['x-twilio-signature'] as string;
    const url = 'https://smsify-api-e90c6e0cdd2d.herokuapp.com/' + req.originalUrl;  // Your server URL + endpoint change this

    if (!twilio.validateRequest(twilioAuthToken, twilioSignature, url, req.body)) {
        console.error('Failed Twilio request validation');
        return res.status(401).send('Invalid request signature.');
    }
    next();
}