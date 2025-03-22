-- Add provider_id column to account table
ALTER TABLE account ADD COLUMN provider_id TEXT NOT NULL;
