import express from "express";
const router = express.Router();
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign, getCampaignById } from "../../../controllers/campaignController";
import passport from "passport";

/**
 * @swagger
 * /api/v1/campaign/:
 *  post:
 *    summary: Create a new campaign
 *    tags:
 *      - Campaign Management
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the campaigns
 *              description:
 *                type: string
 *                description: A brief description of the campaign
 *              phoneNumberId: 
 *                type: integer
 *                description: A phone number associated with the campaign
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
 * /api/v1/campaign/:
 *  get:
 *    summary: Retrieve all campaigns created by the user
 *    tags: [Campaign Management]
 *    security:
 *      - bearerAuth: []
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
 * /api/v1/campaign/{campaignId}:
 *  get:
 *    summary: Retrieve a specific campaign by ID
 *    tags: [Campaign Management]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: campaignId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the campaign to retrieve
 *    responses:
 *      200:
 *        description: Campaign retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Campaign'
 *      404:
 *        description: Campaign not found
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get('/:campaignId', passport.authenticate('jwt', { session: false }), getCampaignById);

/**
 * @swagger
 * /api/v1/campaign/update/{campaignId}:
 *  put:
 *    summary: Update a specific campaign
 *    tags: [Campaign Management]
 *    security:
 *      - bearerAuth: []
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
 *              status:
 *                type: string
 *                description: New status of the campaign
 *              phoneNumberId:
 *                type: number
 *                description: New phone number id of the campaign
 *    responses:
 *      200:
 *        description: Campaign updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Campaign'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Campaign not found or not updated
 *      500:
 *        description: Server error
 */
router.put('/update/:campaignId', passport.authenticate('jwt', { session: false }), updateCampaign);

/**
 * @swagger
 * /api/v1/campaign/delete/{campaignId}:
 *  put:
 *    summary: Delete a specific campaign
 *    tags: [Campaign Management]
 *    security:
 *      - bearerAuth: []
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