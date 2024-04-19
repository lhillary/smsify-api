/**
 * Written by Lydia Hillary
 * Smsify API
 * 2024
 */

import express from "express";
import dotevnv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import { initialize } from "./config/passport";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

dotevnv.config();
initialize(passport);

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) || 3000;

// Require route modules V1
import userV1Routes from "./routes/api/v1/user";
import phoneNumberV1Routes from "./routes/api/v1/phoneNumber";
import contactV1Routes from "./routes/api/v1/contact";
import campaignV1Routes from "./routes/api/v1/campaign";
import smsV1Routes from "./routes/api/v1/smsRoutes";
import subscriptionTierV1Routes from "./routes/api/v1/subscriptionTier";
import categorizationV1Routes from "./routes/api/v1/categorization";

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Use routes V1
app.use('/api/v1/user', userV1Routes);
app.use('/api/v1/phone-number', phoneNumberV1Routes);
app.use('/api/v1/contact', contactV1Routes);
app.use('/api/v1/campaign', campaignV1Routes);
app.use('/api/v1/sms', smsV1Routes);
app.use('/api/v1/subscription', subscriptionTierV1Routes);
app.use('/api/v1/category', categorizationV1Routes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Smsify API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});