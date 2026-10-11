-- Restore the schedule column (add default data type, e.g. TEXT or VARCHAR)
ALTER TABLE job_profiles ADD COLUMN schedule TEXT;

-- Revert table name back to customer_profiles
ALTER TABLE job_profiles RENAME TO customer_profiles;