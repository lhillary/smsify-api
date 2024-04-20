import express from "express";
const router = express.Router();
import { createContact, getContacts, updateContact, deleteContact } from "../../../controllers/contactController";
import passport from "passport";

/**
 * @swagger
 * /api/v1/contact/:
 *  post:
 *    summary: Create a new contact
 *    tags: [Contact Management]
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
 *              - phone_number
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the contact
 *              phone_number:
 *                type: string
 *                description: The phone number of the contact
 *    responses:
 *      201:
 *        description: Contact created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Contact'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post('/', passport.authenticate('jwt', { session: false }), createContact);

/**
 * @swagger
 * /api/v1/contact/:
 *  get:
 *    summary: Retrieve all contacts
 *    tags: [Contact Management]
 *    security:
 *      - jwt: []
 *    responses:
 *      200:
 *        description: List of all contacts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Contact'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get('/', passport.authenticate('jwt', { session: false }), getContacts);

/**
 * @swagger
 * /api/v1/contact/update/{contactId}:
 *  put:
 *    summary: Update an existing contact
 *    tags: [Contact Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: contactId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the contact to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Updated name of the contact
 *              phone_number:
 *                type: string
 *                description: Updated phone number of the contact
 *    responses:
 *      200:
 *        description: Contact updated successfully
 *      404:
 *        description: No contact found or already deleted
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.put('/update/:contactId', passport.authenticate('jwt', { session: false }), updateContact);

/**
 * @swagger
 * /api/v1/contact/delete/{contactId}:
 *  put:
 *    summary: Delete a contact
 *    tags: [Contact Management]
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: contactId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the contact to delete
 *    responses:
 *      204:
 *        description: Contact deleted successfully
 *      404:
 *        description: No contact found or already deleted
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.put('/delete/:contactId', passport.authenticate('jwt', { session: false }), deleteContact);

export default router;