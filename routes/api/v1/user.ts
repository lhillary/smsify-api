import express from "express";
const router = express.Router();
import passport from "passport";
import { registerUser, loginUser, updateUser, deleteUser } from "../../../controllers/userController";

/**
 * @swagger
 * /api/v1/users/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      201:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                token:
 *                  type: string
 *      400:
 *        description: Email already in use
 *      500:
 *        description: Server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/v1/users/login:
 *  post:
 *    summary: Authenticate user and return JWT
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                token:
 *                  type: string
 *      401:
 *        description: Login failed
 *      500:
 *        description: Server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/v1/users/update:
 *  put:
 *    summary: Update user information
 *    tags: [Users]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: User updated successfully
 *      400:
 *        description: No update data provided
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.put('/update', passport.authenticate('jwt', { session: false }), updateUser);

/**
 * @swagger
 * /api/v1/users/delete:
 *  delete:
 *    summary: Delete a user
 *    tags: [Users]
 *    security:
 *      - jwt: []
 *    responses:
 *      204:
 *        description: User deleted successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No user found or already deleted
 *      500:
 *        description: Server error
 */
router.put('/delete', passport.authenticate('jwt', { session: false }), deleteUser);

export default router;