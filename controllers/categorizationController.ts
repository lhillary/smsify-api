import { Request, Response } from 'express';
import Categorization from '../models/Categorization';

export const addCategorization = async (req: Request, res: Response): Promise<void> => {
    const { campaignId, categoryLabels } = req.body;  // categoryLabels should be an array of strings

    try {
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
    const { campaignId } = req.params;
    try {
        const categories = await Categorization.findByCampaign(parseInt(campaignId as string, 10));
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while retrieving categories");
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { newLabel } = req.body;
    const { categoryId } = req.params;

    try {
        const updatedCategory = await Categorization.update(parseInt(categoryId as string, 10), newLabel);
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
    const { categoryId } = req.params;  // Assume category ID is a URL parameter

    try {
        const deletedCategory = await Categorization.delete(parseInt(categoryId as string, 10));
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