import SubscriptionTier from '../models/SubscriptionTier';
import { Request, Response } from "express";

export const createTier = async (req: Request, res: Response) => {
    const { name, description, price } = req.body;
    try {
        const newTier = await SubscriptionTier.create(name, description, price);
        res.status(201).json(newTier);
    } catch (error) {
        console.error("Error creating subscription tier", error);
        res.status(500).send("Error creating subscription tier");
    }
};

export const getTiers = async (req: Request, res: Response) => {
    try {
        const tiers = await SubscriptionTier.findAll();
        res.status(200).json(tiers);
    } catch (error) {
        console.error("Error retrieving subscription tiers:", error);
        res.status(500).send("Server error while retrieving subscription tiers");
    }
};

export const getTierById = async (req: Request, res: Response) => {
    const { tierId } = req.params;
    try {
        const tier = await SubscriptionTier.findById(parseInt(tierId, 10));
        if (!tier) {
            res.status(404).send("Subscription tier not found");
            return;
        }
        res.status(200).json(tier);
    } catch (error) {
        console.error("Error finding subscription tier:", error);
        res.status(500).send("Server error while finding subscription tier");
    }
};

export const updateTier = async (req: Request, res: Response) => {
    const { tierId } = req.params;
    const { name, description, price } = req.body;
    try {
        const updatedTier = await SubscriptionTier.update(parseInt(tierId, 10), name, description, price);
        if (!updatedTier) {
            res.status(404).send("Subscription tier not found or update failed");
            return;
        }
        res.status(200).json(updatedTier);
    } catch (error) {
        console.error("Error updating subscription tier:", error);
        res.status(500).send("Server error while updating subscription tier");
    }
};

export const deleteTier = async (req: Request, res: Response) => {
    const { tierId } = req.params;
    try {
        const result = await SubscriptionTier.delete(parseInt(tierId, 10));
        if (result === 0) {
            res.status(404).send("Subscription tier not found or already deleted");
            return;
        }
        res.status(204).send("Subscription tier deleted successfully");
    } catch (error) {
        console.error("Error deleting subscription tier:", error);
        res.status(500).send("Server error while deleting subscription tier");
    }
};