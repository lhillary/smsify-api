import PhoneNumber from '../models/PhoneNumber';
import twilioClient from '../config/twilio';
import { Request, Response } from "express";

export const listAvailableNumbers = async (req: Request, res: Response) => {
	const searchTerm = req.query.searchTerm as string;
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
    try {
        // Create the phone number in Twilio
        const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
            phoneNumber: phoneNumber, // This should be the full phone number including country code
            smsUrl: "https://smsify-api-e90c6e0cdd2d.herokuapp.com/api/v1/sms/receive" // Gonna have to change this later
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

    try {
        // Find the phone number in the database
        const phoneNumber = await PhoneNumber.findById(parseInt(phoneNumberId as string, 10), userId);
        if (!phoneNumber) {
            res.status(404).send("Phone number not found");
            return;
        }

        // Release the phone number using Twilio's API
        await twilioClient.incomingPhoneNumbers(phoneNumber.twilioSid).remove();

        // Deactivate the phone number in the database
        const updatedPhoneNumber = await PhoneNumber.deactivate(parseInt(phoneNumberId as string, 10), userId);
        res.status(200).json({ message: "Phone number deactivated successfully", phoneNumber: updatedPhoneNumber });
    } catch (error) {
        console.error("Error deactivating phone number:", error);
        res.status(500).send("Failed to deactivate phone number");
    }
};