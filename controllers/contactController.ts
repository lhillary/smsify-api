import Contact from '../models/Contact';
import { Request, Response } from "express";

export const createContact = async (req: Request, res: Response) => {
    const { name, phone_number } = req.body; 
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    try {
        const contact = await Contact.create(userId, name, phone_number);
        res.status(201).json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while creating contact");
    }
};

export const getContacts = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    try {
        const contacts = await Contact.findByUserId(userId);
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving contacts");
    }
};

export const getContactByCampaign = async (req: Request, res: Response) => {
    const { campaignId } = req.params;
    try {
        const contacts = await Contact.findByCampaignId(parseInt(campaignId));
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving contacts");
    }
};

export const updateContact = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { contactId } = req.params;
    const userId = req.user.userId;
    const updates = req.body; 

    try {
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }
        const updatedContact = await Contact.update(parseInt(contactId as string, 10), userId, updates);
        res.json(updatedContact);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while updating contact");
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { contactId } = req.params;
    const userId = req.user.userId;
    try {
        const deletedCount = await Contact.delete(parseInt(contactId as string, 10), userId);
        if (deletedCount && deletedCount > 0) {
            res.status(204).send("Contact deleted successfully");
        } else {
            res.status(404).send("No contact found or already deleted");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while deleting contact");
    }
};