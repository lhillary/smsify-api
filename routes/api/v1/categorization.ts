import express from "express";
const router = express.Router();
import { addCategorization, updateCategory, deleteCategory } from "../../../controllers/categorizationController";
import passport from "passport";

/**
 * @swagger
 * /api/v1/category/:
 *  post:
 *    summary: Add new category to a campaign
 *    tags: [Category Management]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - campaignId
 *              - categoryLabels
 *            properties:
 *              campaignId:
 *                type: integer
 *                description: The ID of the campaign to which categories are added
 *              categoryLabels:
 *                type: array
 *                items:
 *                  type: string
 *                description: List of category labels
 *    responses:
 *      201:
 *        description: categories added successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CampaignCategory'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Failed to add categories due to server error
 */
router.post('/', passport.authenticate('jwt', { session: false }), addCategorization);

/**
 * @swagger
 * /api/v1/category/update/{categoryId}:
 *  put:
 *    summary: Update an existing category
 *    tags: [Category Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the category to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newLabel:
 *                type: string
 *                description: The new label for the category
 *    responses:
 *      200:
 *        description: Category updated successfully
 *      404:
 *        description: Category not found or update failed
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error while updating category
 */
router.put('/update/:categoryId', passport.authenticate('jwt', { session: false }), updateCategory);

/**
 * @swagger
 * /api/v1/category/delete/{categoryId}:
 *  put:
 *    summary: Delete a category
 *    tags: [Category Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the category to delete
 *    responses:
 *      200:
 *        description: Category deleted successfully
 *      404:
 *        description: Category not found or already deleted
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error while deleting category
 */
router.put('/delete/:categoryId', passport.authenticate('jwt', { session: false }), deleteCategory);

export default router;