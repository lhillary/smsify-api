import express from "express";
const router = express.Router();
import { createTier, deleteTier, getTiers, updateTier } from "../../../controllers/subscriptionTierController";
import passport from "passport";
import { isAdmin } from "../../../middlewares/authRoleChecker";

/**
 * @swagger
 * /api/v1/tiers:
 *  post:
 *    summary: Create a new subscription tier
 *    tags: [Subscription Tiers]
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
 *              - price
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: number
 *                format: double
 *    responses:
 *      201:
 *        description: Subscription tier created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SubscriptionTier'
 *      500:
 *        description: Error creating subscription tier
 */
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, createTier);

/**
 * @swagger
 * /api/v1/tiers:
 *  get:
 *    summary: Retrieve all subscription tiers
 *    tags: [Subscription Tiers]
 *    security:
 *      - jwt: []
 *    responses:
 *      200:
 *        description: List of subscription tiers
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/SubscriptionTier'
 *      500:
 *        description: Server error while retrieving subscription tiers
 */
router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, getTiers);

/**
 * @swagger
 * /api/v1/tiers/update/{tierId}:
 *  put:
 *    summary: Update a subscription tier
 *    tags: [Subscription Tiers]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: tierId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the subscription tier to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: number
 *                format: double
 *    responses:
 *      200:
 *        description: Subscription tier updated successfully
 *      404:
 *        description: Subscription tier not found or update failed
 *      500:
 *        description: Server error while updating subscription tier
 */
router.put('/update/:tierId', passport.authenticate('jwt', { session: false }), isAdmin, updateTier);

/**
 * @swagger
 * /api/v1/tiers/delete/{tierId}:
 *  delete:
 *    summary: Delete a subscription tier
 *    tags: [Subscription Tiers]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: tierId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the subscription tier to delete
 *    responses:
 *      204:
 *        description: Subscription tier deleted successfully
 *      404:
 *        description: Subscription tier not found or already deleted
 *      500:
 *        description: Server error while deleting subscription tier
 */
router.put('/delete/:tierId', passport.authenticate('jwt', { session: false }), isAdmin, deleteTier);

export default router;