-- Set default values for type and provider columns
ALTER TABLE accounts ALTER COLUMN type SET DEFAULT 'credentials';
UPDATE accounts SET type = 'credentials' WHERE type IS NULL;
ALTER TABLE accounts ALTER COLUMN provider SET DEFAULT 'credentials';
UPDATE accounts SET provider = 'credentials' WHERE provider IS NULL;

-- Set provider_account_id to match the user's email for existing accounts
UPDATE accounts a 
SET provider_account_id = u.email 
FROM users u 
WHERE a.user_id = u.id AND a.provider_account_id IS NULL;

-- Add a trigger to automatically set provider_account_id to email for new accounts
CREATE OR REPLACE FUNCTION set_provider_account_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.provider_account_id IS NULL THEN
    NEW.provider_account_id = (SELECT email FROM users WHERE id = NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER accounts_set_provider_account_id
BEFORE INSERT ON accounts
FOR EACH ROW
EXECUTE FUNCTION set_provider_account_id();
