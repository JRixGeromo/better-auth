-- Drop the account table and recreate it with default values
DROP TABLE IF EXISTS account;

CREATE TABLE account (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL DEFAULT 'default',
  provider_id TEXT NOT NULL DEFAULT 'better-auth',
  password TEXT,
  user_id TEXT REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL DEFAULT 'credentials',
  provider TEXT NOT NULL DEFAULT 'better-auth',
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at TIMESTAMP,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
