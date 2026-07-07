# Smsify API

Smsify is a REST API for running SMS outreach campaigns. Users create campaigns, upload contacts, and send bulk text messages through Twilio. Incoming replies are captured via Twilio webhooks and automatically sorted into campaign-defined categories using OpenAI, so you can see at a glance how people responded.

Built with Node.js, Express, and TypeScript, backed by PostgreSQL. Authentication uses JWT (Passport), and interactive API docs are served from Swagger UI at `/api-docs`.

## API overview

All endpoints are versioned under `/api/v1`:

- `/user` — registration, login, and account management
- `/phone-number` — provision and manage Twilio phone numbers
- `/contact` — manage campaign contacts
- `/campaign` — create and manage campaigns
- `/sms` — send bulk SMS, receive replies, and track delivery status
- `/category` — define categories for classifying responses
- `/subscription` — subscription tiers

## Local development

Requires Node 24 (`nvm use`) and a running PostgreSQL database.

```bash
cp .env.example .env   # then fill in values
npm install
npm run dev
```

## Deployment

Deployed to Heroku via the included `Procfile`. The `heroku-postbuild` script compiles TypeScript to `build/`. Requires a Heroku Postgres add-on plus the environment variables listed in `.env.example` set as config vars.

## License

Distributed under the MIT License.
