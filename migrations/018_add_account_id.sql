-- Add account_id column to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_id TEXT NOT NULL DEFAULT gen_random_uuid();
