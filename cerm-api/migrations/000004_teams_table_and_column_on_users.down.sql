-- Remove team_id column from the users table
ALTER TABLE users 
DROP COLUMN IF EXISTS team_id;

-- Drop the teams table
DROP TABLE IF EXISTS teams;