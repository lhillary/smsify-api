import dotevnv from "dotenv";
dotevnv.config();
import twilio from 'twilio';
import { IUser } from '../types/interfaces';

/**
 * Client acting on a customer's Twilio account via Twilio Connect.
 * Per Twilio's Connect docs, requests authenticate with the connected
 * Account SID as the username and OUR auth token as the password.
 */
export function clientForConnectedAccount(connectedAccountSid: string) {
    return twilio(connectedAccountSid, process.env.TWILIO_AUTH_TOKEN, {
        accountSid: connectedAccountSid,
    });
}

/**
 * Resolves the Twilio client for a request's user. Every user, including
 * admins, must authorize our Connect App; null means "not connected yet"
 * and callers should respond 403.
 */
export function twilioClientForUser(user: IUser) {
    return user.connectedAccountSid
        ? clientForConnectedAccount(user.connectedAccountSid)
        : null;
}
