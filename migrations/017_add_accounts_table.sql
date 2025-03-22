-- Remove password and temp_password columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS password;
ALTER TABLE users DROP COLUMN IF EXISTS temp_password;

-- Handle column renames in accounts table
ALTER TABLE accounts RENAME COLUMN provider_id TO type;
ALTER TABLE accounts RENAME COLUMN account_id TO provider;

-- Add new columns to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS provider_type TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS refresh_token TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS access_token TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS token_type TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS scope TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS id_token TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS session_state TEXT;
