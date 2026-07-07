-- Twilio Connect: stores the Account SID a user authorized via the Connect App.
-- Run against local and Heroku databases (heroku pg:psql) before deploying.
ALTER TABLE users ADD COLUMN IF NOT EXISTS connected_account_sid VARCHAR(34);
CREATE UNIQUE INDEX IF NOT EXISTS users_connected_account_sid_idx
    ON users (connected_account_sid)
    WHERE connected_account_sid IS NOT NULL;
