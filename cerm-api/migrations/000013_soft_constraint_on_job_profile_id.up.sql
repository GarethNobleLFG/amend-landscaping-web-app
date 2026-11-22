ALTER TABLE jobs
ALTER COLUMN job_profile_id DROP NOT NULL;

ALTER TABLE jobs
ADD CONSTRAINT fk_jobs_job_profile_id
FOREIGN KEY (job_profile_id)
REFERENCES job_profiles (id)
ON DELETE SET NULL;