import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Smsify API',
        version: '1.0.0',
        description: 'This is a REST API application made with Express. It manages contacts, campaigns, messages, and more for Smsify.',
        contact: {
            name: 'API Support',
            url: 'http://www.example.com/support',
            email: 'support@example.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Development server',
        },
    ],
    components: {
      schemas: {
          User: {
              type: 'object',
              properties: {
                  userId: { type: 'integer', example: 1 },
                  username: { type: 'string', example: 'johndoe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  createdAt: { type: 'string', format: 'date-time', example: '2021-07-21T17:32:28Z' },
                  lastLogin: { type: 'string', format: 'date-time', example: '2021-07-22T12:34:56Z' },
                  passwordHash: { type: 'string', example: 'hashed_password' },
                  deletedAt: { type: 'string', format: 'date-time' },
                  tierId: { type: 'integer', example: 2 },
                  role: { type: 'string', example: 'admin' }
              },
              required: ['userId', 'username', 'email', 'passwordHash', 'tierId', 'role']
          },
          PhoneNumber: {
              type: 'object',
              properties: {
                  phoneNumberId: { type: 'integer', example: 100 },
                  userId: { type: 'integer', example: 1 },
                  phoneNumber: { type: 'string', example: '+15551234567' },
                  country: { type: 'string', example: 'USA' },
                  isActive: { type: 'boolean', example: true },
                  purchasedAt: { type: 'string', format: 'date-time', example: '2021-07-21T17:32:28Z' },
                  deletedAt: { type: 'string', format: 'date-time' },
                  twilioSid: { type: 'string', example: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' }
              },
              required: ['phoneNumberId', 'userId', 'phoneNumber', 'country', 'isActive', 'twilioSid']
          },
          Contact: {
              type: 'object',
              properties: {
                  contactId: { type: 'integer', example: 300 },
                  userId: { type: 'integer', example: 1 },
                  name: { type: 'string', example: 'Jane Doe' },
                  phoneNumber: { type: 'string', example: '+15557654321' },
                  createdAt: { type: 'string', format: 'date-time', example: '2021-07-21T17:32:28Z' },
                  deletedAt: { type: 'string', format: 'date-time' }
              },
              required: ['contactId', 'userId', 'name', 'phoneNumber']
          },
          Campaign: {
            type: 'object',
            properties: {
                campaignId: { type: 'integer', example: 10 },
                userId: { type: 'integer', example: 1 },
                phoneNumber: { type: 'integer', example: 101 },
                name: { type: 'string', example: 'Holiday Promo' },
                status: { type: 'string', example: 'active' },
                createdAt: { type: 'string', format: 'date-time', example: '2021-08-01T17:32:28Z' },
                deletedAt: { type: 'string', format: 'date-time' },
                description: { type: 'string', example: 'Holiday promotion campaign' }
            },
            required: ['campaignId', 'userId', 'name']
        },
        SubscriptionTier: {
            type: 'object',
            properties: {
                tierId: { type: 'integer', example: 1 },
                tierName: { type: 'string', example: 'Premium' },
                description: { type: 'string', example: 'Access to premium features' },
                price: { type: 'number', format: 'float', example: 9.99 }
            },
            required: ['tierId', 'tierName', 'price']
        },
        Message: {
            type: 'object',
            properties: {
                messageId: { type: 'integer', example: 500 },
                campaignId: { type: 'integer', example: 10 },
                contactId: { type: 'integer', example: 200 },
                messageContent: { type: 'string', example: 'Don’t miss our special holiday sale!' },
                sentAt: { type: 'string', format: 'date-time', example: '2021-08-02T10:00:00Z' },
                status: { type: 'string', example: 'sent' },
                deletedAt: { type: 'string', format: 'date-time' },
                twilioSid: { type: 'string', example: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' }
            },
            required: ['messageId', 'campaignId', 'contactId', 'messageContent']
        },
        Response: {
            type: 'object',
            properties: {
                responseId: { type: 'integer', example: 600 },
                messageId: { type: 'integer', example: 500 },
                responseContent: { type: 'string', example: 'Yes, I am interested!' },
                receivedAt: { type: 'string', format: 'date-time', example: '2021-08-02T12:34:56Z' },
                deletedAt: { type: 'string', format: 'date-time' }
            },
            required: ['responseId', 'messageId', 'responseContent']
        },
        CampaignCategory: {
            type: 'object',
            properties: {
                categoryId: { type: 'integer', example: 700 },
                campaignId: { type: 'integer', example: 10 },
                categoryLabel: { type: 'string', example: 'Interested' },
                createdAt: { type: 'string', format: 'date-time', example: '2021-08-01T00:00:00Z' },
                deletedAt: { type: 'string', format: 'date-time' }
            },
            required: ['categoryId', 'campaignId', 'categoryLabel']
        },
        ResponseCategorization: {
            type: 'object',
            properties: {
                categorizationId: { type: 'integer', example: 800 },
                responseId: { type: 'integer', example: 600 },
                categoryId: { type: 'integer', example: 700 },
                deletedAt: { type: 'string', format: 'date-time' }
            },
            required: ['categorizationId', 'responseId', 'categoryId']
        },
      }
  }
};

const options = {
    swaggerDefinition,
    apis: ['./routes/api/v1/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
