ALTER TABLE jobs
    ADD COLUMN name TEXT,
    ADD COLUMN email TEXT,
    ADD COLUMN phone_number TEXT,
    ADD COLUMN address TEXT,
    ADD COLUMN job_payout NUMERIC(12, 2),
