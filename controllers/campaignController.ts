import { Request, Response } from "express";
import Campaign from '../models/Campaign';

export const createCampaign = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    const { name, description } = req.body;
    try {
        const campaign = await Campaign.create(userId, name, description);
        res.status(201).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while creating campaign");
    }
};

export const getCampaigns = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const userId = req.user.userId;
    try {
        const campaigns = await Campaign.findByUserId(userId);
        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving campaigns");
    }
};

export const getCampaignById = async (req: Request, res: Response) => {
    const { campaignId } = req.params;

    try {
        const campaign = await Campaign.findById(parseInt(campaignId, 10));
        if (!campaign) {
            res.status(404).send("Campaign not found");
        } else {
            res.json(campaign);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving campaign");
    }
};

export const updateCampaign = async (req: Request, res: Response) => {
    const { campaignId } = req.params;
    const updates = req.body; 

    try {
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }
        const updatedCampaign = await Campaign.update(parseInt(campaignId as string, 10), updates);
        if (!updatedCampaign) {
            res.status(404).send("No campaign found or update failed");
        } else {
            res.status(200).json(updatedCampaign);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while updating campaign");
    }
};

export const deleteCampaign = async (req: Request, res: Response) => {
    const { campaignId } = req.params;
    try {
        const deletedCount = await Campaign.delete(parseInt(campaignId as string, 10));
        if (deletedCount && deletedCount > 0) {
            res.status(204).send("Campaign deleted successfully");
        } else {
            res.status(404).send("No campaign found or already deleted");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while deleting campaign");
    }
};