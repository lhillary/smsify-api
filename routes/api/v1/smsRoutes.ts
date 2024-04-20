import express from 'express';
import passport from 'passport';
import { validateTwilioRequest } from '../../../middlewares/twilioValidation';
import { handleMessageStatus, receiveSMS, sendBulkSMS, getResponsesByCampaign, getMessagesByCampaign } from '../../../controllers/smsController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/sms/sendBulk:
 *  post:
 *    summary: Send bulk SMS to all contacts in a campaign
 *    tags: [SMS]
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
 *              - messageContent
 *              - twilioNumber
 *            properties:
 *              campaignId:
 *                type: integer
 *                description: The ID of the campaign
 *              messageContent:
 *                type: string
 *                description: The content of the message to send
 *              twilioNumber:
 *                type: string
 *                description: The Twilio phone number to send from
 *    responses:
 *      201:
 *        description: Bulk SMS sent successfully
 *      500:
 *        description: Error sending SMS
 */
router.post('/sendBulk', passport.authenticate('jwt', { session: false }), sendBulkSMS);

/**
 * @swagger
 * /api/v1/sms/receive:
 *  post:
 *    summary: Receive incoming SMS responses
 *    tags: [SMS]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              Body:
 *                type: string
 *                description: The content of the incoming SMS
 *              MessageSid:
 *                type: string
 *                description: The Twilio SID associated with the message
 *    responses:
 *      200:
 *        description: Received and processed the response successfully
 *      404:
 *        description: Original message not found
 *      500:
 *        description: Error processing received SMS
 */
router.post('/receive', validateTwilioRequest, receiveSMS);

/**
 * @swagger
 * /api/v1/sms/status:
 *  post:
 *    summary: Handle message status updates from Twilio
 *    tags: [SMS]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              MessageSid:
 *                type: string
 *                description: The Twilio SID of the message
 *              MessageStatus:
 *                type: string
 *                description: The current status of the message
 *    responses:
 *      200:
 *        description: Status updated successfully
 *      500:
 *        description: Failed to update status
 */
router.post('/status', validateTwilioRequest, handleMessageStatus);

/**
 * @swagger
 * /api/v1/sms/responses/{campaignId}:
 *  get:
 *    summary: Fetch all responses for a specific campaign
 *    tags: [SMS]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: campaignId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The campaign ID to fetch responses for
 *    responses:
 *      200:
 *        description: A list of responses
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Response'
 *      404:
 *        description: No responses found or campaign does not exist
 *      500:
 *        description: Failed to fetch responses
 */
router.get('/responses/:campaignId', passport.authenticate('jwt', { session: false }), getResponsesByCampaign);

/**
 * @swagger
 * /api/v1/sms/messages/{campaignId}:
 *  get:
 *    summary: Fetch all messages sent in a specific campaign
 *    tags: [SMS]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: campaignId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The campaign ID to fetch messages for
 *    responses:
 *      200:
 *        description: A list of messages
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Message'
 *      404:
 *        description: No messages found for this campaign
 *      500:
 *        description: Failed to fetch messages
 */
router.get('/messages/:campaignId', passport.authenticate('jwt', { session: false }), getMessagesByCampaign);

export default router;