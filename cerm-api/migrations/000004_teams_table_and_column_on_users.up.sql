-- Create the teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add team_id column to the users table with a foreign key constraint
ALTER TABLE users 
ADD COLUMN team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL;