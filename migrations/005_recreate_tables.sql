-- Drop tables in correct order
DROP TABLE IF EXISTS password_reset;
DROP TABLE IF EXISTS email_verification;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Recreate users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recreate sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  expires_at TIMESTAMP
);

-- Recreate email_verification table
CREATE TABLE email_verification (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recreate password_reset table
CREATE TABLE password_reset (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
