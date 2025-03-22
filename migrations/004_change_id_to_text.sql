-- Drop foreign key constraints first
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE email_verification DROP CONSTRAINT IF EXISTS email_verification_user_id_fkey;
ALTER TABLE password_reset DROP CONSTRAINT IF EXISTS password_reset_user_id_fkey;

-- Change ID columns from UUID to TEXT
ALTER TABLE users ALTER COLUMN id TYPE TEXT;
ALTER TABLE sessions ALTER COLUMN id TYPE TEXT, ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE email_verification ALTER COLUMN id TYPE TEXT, ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE password_reset ALTER COLUMN id TYPE TEXT, ALTER COLUMN user_id TYPE TEXT;

-- Re-add foreign key constraints
ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE email_verification ADD CONSTRAINT email_verification_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE password_reset ADD CONSTRAINT password_reset_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
