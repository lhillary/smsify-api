import { Request, Response } from "express";
import twilioClient from '../config/twilio';
import Message from "../models/Message";
import ResponseModel from "../models/Response";
import Categorization from "../models/Categorization";
import ResponseCategorization from "../models/ResponseCategorization";
import Contact from '../models/Contact';
import categorizeResponse from "../helpers/categorizeResponse";
import { ICampaignCategory } from "types/interfaces";

export const sendBulkSMS = async (req: Request, res: Response): Promise<void> => {
    const { campaignId, messageContent, twilioNumber } = req.body;
    try {
        const contacts = await Contact.findByCampaignId(campaignId);  // Retrieve contacts for the campaign

        const messagePromises = contacts.map(contact => {
            return twilioClient.messages.create({
                body: messageContent,
                to: contact.phoneNumber,
                from: twilioNumber,
                statusCallback: 'https://smsify-api-e90c6e0cdd2d.herokuapp.com/api/v1/sms/status' // change this later
            }).then(message => {
                return Message.create({
                    campaignId,
                    contactId: contact.contactId,
                    messageContent,
                    twilioSid: message.sid,
                    status: 'pending'
                });
            });
        });

        await Promise.all(messagePromises);
        res.status(201).json({ message: "Bulk SMS sent successfully" });
    } catch (error) {
        console.error("Error sending bulk SMS:", error);
        res.status(500).send("Error sending SMS");
    }
};

async function findMessageBySid(twilioSid: string) {
    return await Message.findByTwilioSid(twilioSid);
}

async function handleResponseCreation(messageId: number, responseContent: string, categories: ICampaignCategory[], originalMessageContent: string) {
    const response = await ResponseModel.create({
        messageId,
        responseContent,
    });

    if (!response || !response.responseId) {
        throw new Error("Failed to create response");
    }

    const category = await categorizeResponse(responseContent, categories, originalMessageContent);
    if (category) {
        await ResponseCategorization.create(response.responseId, category);
        console.log(`Response categorized as: ${category}`);
    } else {
        console.log("No valid category determined for the response.");
    }

    return "<Response></Response>";
}

export const receiveSMS = async (req: Request, res: Response): Promise<void> => {
    const { Body: responseContent, MessageSid: twilioSid } = req.body;
    console.log(`Received response for Twilio SID ${twilioSid}: ${responseContent}`);

    try {
        const originalMessage = await findMessageBySid(twilioSid);
        if (!originalMessage) {
            console.log("No matching outgoing message found for the Twilio SID provided.");
            res.status(404).send("Original message not found");
            return;
        }

        const categories = await Categorization.findByCampaign(originalMessage.campaignId);
        if (originalMessage.messageId) {
            const twiMLResponse = await handleResponseCreation(originalMessage.messageId, responseContent, categories, originalMessage.messageContent);
            res.status(200).send(twiMLResponse); // Send a blank TwiML response to acknowledge receipt
        } else {
            throw new Error("Message ID is null, cannot save response.");
        }
    } catch (error) {
        console.error("Error processing received SMS:", error);
        res.status(500).send("There was an error processing received SMS");
    }
};

export const getResponsesByCampaign = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    const { campaignId } = req.params;

    try {
        const responses = await ResponseModel.findAllByCampaignId(userId, parseInt(campaignId));
        res.json(responses);
    } catch (error) {
        console.error("Error fetching responses for campaign:", error);
        res.status(500).send("Failed to fetch responses");
    }
};

export const getMessagesByCampaign = async (req: Request, res: Response): Promise<void> => {
    const { campaignId } = req.params;

    try {
        const messages = await Message.findByCampaignId(parseInt(campaignId));
		res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("Failed to fetch messages");
    }
};

export const handleMessageStatus = async (req: Request, res: Response): Promise<void> => {
    const { MessageSid, MessageStatus } = req.body;  // Twilio sends the message SID and status update

    try {
        await Message.updateStatusBySid(MessageSid, MessageStatus);
        res.status(200).send("Status updated successfully");
    } catch (error) {
        console.error("Error updating message status:", error);
        res.status(500).send("Failed to update status");
    }
};