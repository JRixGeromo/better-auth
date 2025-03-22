-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Update users table
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update sessions table
ALTER TABLE sessions 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update email_verification table
ALTER TABLE email_verification 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update password_reset table
ALTER TABLE password_reset 
ALTER COLUMN id SET DEFAULT gen_random_uuid();
