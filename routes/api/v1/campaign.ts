import express from "express";
const router = express.Router();
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign } from "../../../controllers/campaignController";
import passport from "passport";

/**
 * @swagger
 * /campaigns/:
 *  post:
 *    summary: Create a new campaign
 *    tags: [Campaign Management]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - description
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the campaign
 *              description:
 *                type: string
 *                description: A brief description of the campaign
 *    responses:
 *      201:
 *        description: Campaign created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Campaign'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error while creating campaign
 */
router.post('/', passport.authenticate('jwt', { session: false }), createCampaign);

/**
 * @swagger
 * /campaigns/:
 *  get:
 *    summary: Retrieve all campaigns created by the user
 *    tags: [Campaign Management]
 *    security:
 *      - jwt: []
 *    responses:
 *      200:
 *        description: An array of campaigns
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Campaign'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error while retrieving campaigns
 */
router.get('/', passport.authenticate('jwt', { session: false }), getCampaigns);

/**
 * @swagger
 * /update/{campaignId}:
 *  put:
 *    summary: Update a specific campaign
 *    tags: [Campaign Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: campaignId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the campaign to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: New name of the campaign
 *              description:
 *                type: string
 *                description: New description of the campaign
 *    responses:
 *      200:
 *        description: Campaign updated successfully
 *      404:
 *        description: No campaign found or update failed
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error while updating campaign
 */
router.put('/update/:campaignId', passport.authenticate('jwt', { session: false }), updateCampaign);

/**
 * @swagger
 * /delete/{campaignId}:
 *  put:
 *    summary: Delete a specific campaign
 *    tags: [Campaign Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: campaignId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the campaign to delete
 *    responses:
 *      204:
 *        description: Campaign deleted successfully
 *      404:
 *        description: No campaign found or already deleted
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error while deleting campaign
 */
router.put('/delete/:campaignId', passport.authenticate('jwt', { session: false }), deleteCampaign);

export default router;