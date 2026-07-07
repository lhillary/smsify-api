import PhoneNumber from '../models/PhoneNumber';
import { twilioClientForUser } from '../config/twilio';
import { syncUserPhoneNumbers } from '../helpers/syncPhoneNumbers';
import { Request, Response } from "express";

export const listAvailableNumbers = async (req: Request, res: Response) => {
	const searchTerm = req.query.searchTerm as string;
    if (!req.user) {
        return res.status(401).send("Unauthorized");
    }
    const twilioClient = twilioClientForUser(req.user);
    if (!twilioClient) {
        return res.status(403).json({ message: 'Connect your Twilio account to use SMS features' });
    }
    try {
        const availableNumbers = await twilioClient.availablePhoneNumbers('US').local.list({contains: searchTerm, smsEnabled: true, limit: 25});
        res.json(availableNumbers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving phone numbers from Twilio');
    }
};

export const purchasePhoneNumber = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { phoneNumber, country } = req.body;  // Ensure country is provided or set a default
    const twilioClient = twilioClientForUser(req.user);
    if (!twilioClient) {
        return res.status(403).json({ message: 'Connect your Twilio account to use SMS features' });
    }
    try {
        // Create the phone number in Twilio
        const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
            phoneNumber: phoneNumber, // This should be the full phone number including country code
            smsUrl: `${process.env.BASE_URL}/api/v1/sms/receive`
        });

        // Store the new phone number in your database including the Twilio SID
        const newPhoneNumber = await PhoneNumber.create(req.user.userId, purchasedNumber.phoneNumber, country, purchasedNumber.sid);
        res.json({ message: 'Phone number purchased and registered successfully', newPhoneNumber });
    } catch (err) {
        console.error("Failed to purchase phone number", err);
        res.status(500).send('Failed to purchase phone number');
    }
};

export const getUserPhoneNumbers = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        // ?sync=true re-checks ownership against the connected Twilio account
        if (req.query.sync === 'true' && req.user.connectedAccountSid) {
            const synced = await syncUserPhoneNumbers(req.user);
            if (synced) {
                res.json(synced);
                return;
            }
        }
        const phoneNumbers = await PhoneNumber.findByUserId(req.user.userId);
        res.json(phoneNumbers);
    } catch (err) {
        console.error("Error retrieving user's phone numbers:", err);
        res.status(500).send('Error retrieving phone numbers');
    }
};

export const deletePhoneNumber = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { phoneNumberId } = req.params;
    const userId = req.user.userId;
    const twilioClient = twilioClientForUser(req.user);
    if (!twilioClient) {
        return res.status(403).json({ message: 'Connect your Twilio account to use SMS features' });
    }

    try {
        // Find the phone number in the database
        const phoneNumber = await PhoneNumber.findById(parseInt(phoneNumberId as string, 10), userId);
        if (!phoneNumber) {
            res.status(404).send("Phone number not found");
            return;
        }

        // Release via Twilio only if the connected account still owns it
        // (is_active is maintained by the ownership sync); a number that's
        // gone or owned elsewhere should still be removable from the app
        if (phoneNumber.isActive) {
            try {
                await twilioClient.incomingPhoneNumbers(phoneNumber.twilioSid).remove();
            } catch (twilioError) {
                const status = (twilioError as { status?: number }).status;
                if (status !== 404) throw twilioError;
            }
        }

        // Deactivate the phone number in the database
        const updatedPhoneNumber = await PhoneNumber.deactivate(parseInt(phoneNumberId as string, 10), userId);
        res.status(200).json({ message: "Phone number deactivated successfully", phoneNumber: updatedPhoneNumber });
    } catch (error) {
        console.error("Error deactivating phone number:", error);
        res.status(500).send("Failed to deactivate phone number");
    }
};