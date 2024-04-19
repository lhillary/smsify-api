import express from "express";
const router = express.Router();
import { deletePhoneNumber, listAvailableNumbers, purchasePhoneNumber } from "../../../controllers/phoneNumberController";
import passport from "passport";

/**
 * @swagger
 * /api/v1/phone-numbers/available-numbers:
 *  get:
 *    summary: List available Twilio phone numbers
 *    tags: [Phone Number Management]
 *    security:
 *      - jwt: []
 *    responses:
 *      200:
 *        description: List of available phone numbers from Twilio
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  friendlyName:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *      500:
 *        description: Error retrieving phone numbers
 */
router.get('/available-numbers', passport.authenticate('jwt', { session: false }), listAvailableNumbers);

/**
 * @swagger
 * /api/v1/phone-numbers/purchase-number:
 *  post:
 *    summary: Purchase and register a new phone number
 *    tags: [Phone Number Management]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - phoneNumber
 *              - country
 *            properties:
 *              phoneNumber:
 *                type: string
 *                description: The phone number to be purchased
 *              country:
 *                type: string
 *                description: The country of the phone number
 *    responses:
 *      200:
 *        description: Phone number purchased and registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PhoneNumber'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Failed to purchase phone number
 */
router.post('/purchase-number', passport.authenticate('jwt', { session: false }), purchasePhoneNumber);

/**
 * @swagger
 * /api/v1/phone-numbers/delete/{phoneNumberId}:
 *  put:
 *    summary: Deactivate a registered phone number
 *    tags: [Phone Number Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: phoneNumberId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the phone number to deactivate
 *    responses:
 *      200:
 *        description: Phone number deactivated successfully
 *      404:
 *        description: Phone number not found
 *      500:
 *        description: Failed to deactivate phone number
 */
router.put('/delete/:phoneNumberId', passport.authenticate('jwt', { session: false }), deletePhoneNumber);

export default router;