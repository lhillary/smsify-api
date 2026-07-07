import express from "express";
import passport from "passport";
import { connectTwilioAccount, disconnectTwilioAccount, deauthorizeCallback } from "../../../controllers/twilioConnectController";
import { validateTwilioRequest } from "../../../middlewares/twilioValidation";

const router = express.Router();

/**
 * @swagger
 * /api/v1/twilio-connect:
 *  post:
 *    summary: Link the Twilio account a user authorized via our Connect App
 *    tags: [Twilio Connect]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - accountSid
 *            properties:
 *              accountSid:
 *                type: string
 *                description: The AccountSid returned on the Connect authorize redirect
 *    responses:
 *      200:
 *        description: Twilio account connected
 *      400:
 *        description: Invalid or unauthorized Account SID
 *      409:
 *        description: Account already connected to another user
 */
router.post('/', passport.authenticate('jwt', { session: false }), connectTwilioAccount);

/**
 * @swagger
 * /api/v1/twilio-connect:
 *  delete:
 *    summary: Unlink the user's connected Twilio account
 *    tags: [Twilio Connect]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Twilio account disconnected
 */
router.delete('/', passport.authenticate('jwt', { session: false }), disconnectTwilioAccount);

/**
 * @swagger
 * /api/v1/twilio-connect/deauthorize:
 *  post:
 *    summary: Twilio webhook fired when a customer revokes our Connect App
 *    tags: [Twilio Connect]
 *    responses:
 *      200:
 *        description: Deauthorization processed
 */
router.post('/deauthorize', validateTwilioRequest, deauthorizeCallback);

export default router;
