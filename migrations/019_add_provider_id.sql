-- Add provider_id column to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS provider_id TEXT NOT NULL DEFAULT 'credentials';
