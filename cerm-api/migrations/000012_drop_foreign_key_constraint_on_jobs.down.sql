ALTER TABLE jobs
ADD CONSTRAINT fk_jobs_job_profile_id
FOREIGN KEY (job_profile_id)
REFERENCES job_profiles (id);