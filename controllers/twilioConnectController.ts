import { Request, Response } from "express";
import User from '../models/User';
import { clientForConnectedAccount } from '../config/twilio';
import { syncUserPhoneNumbers } from '../helpers/syncPhoneNumbers';

const ACCOUNT_SID_PATTERN = /^AC[0-9a-fA-F]{32}$/;

/**
 * Saves the Account SID handed back by Twilio's Connect authorize redirect.
 * The frontend receives ?AccountSid=... on the Authorize URL page and posts
 * it here with the user's JWT.
 */
export const connectTwilioAccount = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).send("Unauthorized");
    }
    const { accountSid } = req.body;

    if (typeof accountSid !== 'string' || !ACCOUNT_SID_PATTERN.test(accountSid)) {
        return res.status(400).json({ message: 'accountSid must be a valid Twilio Account SID (AC...)' });
    }

    try {
        const existing = await User.findByConnectedAccountSid(accountSid);
        if (existing && existing.userId !== req.user.userId) {
            return res.status(409).json({ message: 'This Twilio account is already connected to another user' });
        }

        // Prove the SID was really authorized for our Connect App: a fetch of
        // the account with Connect-style auth fails with 401 if it wasn't.
        try {
            await clientForConnectedAccount(accountSid).api.v2010.accounts(accountSid).fetch();
        } catch {
            return res.status(400).json({ message: 'Twilio rejected this account. Complete the Connect authorization flow and try again.' });
        }

        const updatedUser = await User.setConnectedAccountSid(req.user.userId, accountSid);

        // Reconcile stored numbers against what the connected account owns;
        // a sync failure shouldn't undo a successful connection
        try {
            if (updatedUser) await syncUserPhoneNumbers(updatedUser);
        } catch (syncError) {
            console.error("Phone number sync after connect failed:", syncError);
        }

        res.json({ message: 'Twilio account connected', connectedAccountSid: updatedUser?.connectedAccountSid });
    } catch (error) {
        console.error("Error connecting Twilio account:", error);
        res.status(500).send('Failed to connect Twilio account');
    }
};

export const disconnectTwilioAccount = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        await User.setConnectedAccountSid(req.user.userId, null);
        res.json({ message: 'Twilio account disconnected' });
    } catch (error) {
        console.error("Error disconnecting Twilio account:", error);
        res.status(500).send('Failed to disconnect Twilio account');
    }
};

/**
 * Webhook Twilio calls when a customer revokes our Connect App from their
 * Twilio console. Authenticity is checked by Twilio signature middleware.
 */
export const deauthorizeCallback = async (req: Request, res: Response) => {
    const accountSid = req.body.AccountSid;
    if (typeof accountSid !== 'string' || !ACCOUNT_SID_PATTERN.test(accountSid)) {
        return res.status(400).send('Missing AccountSid');
    }
    try {
        await User.clearConnectedAccountSid(accountSid);
        res.status(200).send('OK');
    } catch (error) {
        console.error("Error handling Connect deauthorization:", error);
        res.status(500).send('Failed to process deauthorization');
    }
};
