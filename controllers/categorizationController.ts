import { Request, Response } from 'express';
import Categorization from '../models/Categorization';
import Campaign from '../models/Campaign';

export const addCategorization = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { campaignId, categoryLabels } = req.body;

    try {
        // Categories hang off campaigns, so ownership is checked there
        const campaign = await Campaign.findById(campaignId, req.user.userId);
        if (!campaign) {
            res.status(404).send("Campaign not found");
            return;
        }
        const categories = await Promise.all(categoryLabels.map((label: string) =>
            Categorization.create(campaignId, label)
        ));
        res.status(201).json(categories);
    } catch (error) {
        console.error("Error adding categorization:", error);
        res.status(500).send("Failed to add categorization");
    }
};

export const getCategoryByCampaign = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { campaignId } = req.params;
    try {
        const categories = await Categorization.findByCampaign(parseInt(campaignId as string, 10), req.user.userId);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving categories");
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { newLabel } = req.body;
    const { categoryId } = req.params;

    try {
        const updatedCategory = await Categorization.update(parseInt(categoryId as string, 10), req.user.userId, newLabel);
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).send("Category not found or already deleted.");
        }
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Failed to update category");
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.userId) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Categorization.delete(parseInt(categoryId as string, 10), req.user.userId);
        if (deletedCategory) {
            res.status(200).json({ message: "Category successfully deleted", category: deletedCategory });
        } else {
            res.status(404).send("Category not found or already deleted.");
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Failed to delete category");
    }
};