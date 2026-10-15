-- Migration: Create customer_profiles table with classic auto-incrementing IDs
CREATE TABLE IF NOT EXISTS customer_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    services_requested JSONB NOT NULL DEFAULT '{}'::jsonb,
    scheduled_date TIMESTAMPTZ,
    description TEXT,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_commercial BOOLEAN NOT NULL DEFAULT FALSE,
    is_seen BOOLEAN NOT NULL DEFAULT FALSE,
    referral_info VARCHAR(255),
    schedule VARCHAR(255),
    admin_notes TEXT,
    job_payout NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);