CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    job_profile_id INT NOT NULL REFERENCES job_profiles(id) ON DELETE CASCADE,
    team_id INT REFERENCES teams(id) ON DELETE SET NULL,
    scheduled_day DATE NOT NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_jobs_job_profile_id ON jobs(job_profile_id);
CREATE INDEX IF NOT EXISTS idx_jobs_team_id ON jobs(team_id);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_day ON jobs(scheduled_day);