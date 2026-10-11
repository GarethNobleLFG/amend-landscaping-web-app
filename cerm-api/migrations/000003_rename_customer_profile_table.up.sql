-- Rename table from customer_profiles to job_profiles
ALTER TABLE customer_profiles RENAME TO job_profiles;

-- Drop the schedule column
ALTER TABLE job_profiles DROP COLUMN schedule;