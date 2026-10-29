package repository

import (
	"context"
	"database/sql"
	"fmt"

	"cerm-api/internal/model"
)

type JobRepository interface {
	Create(ctx context.Context, job *model.Job) (int64, error)
	GetByID(ctx context.Context, id int64) (*model.Job, error)
	GetAll(ctx context.Context) ([]model.Job, error)
	GetByMonthAndYear(ctx context.Context, month int, year int) ([]model.Job, error)
	Update(ctx context.Context, job *model.Job) error
	Delete(ctx context.Context, id int64) error
}

type jobRepo struct {
	db *sql.DB
}

func NewJobRepository(db *sql.DB) JobRepository {
	return &jobRepo{db: db}
}

// Create inserts a new job record and returns its generated ID
func (r *jobRepo) Create(ctx context.Context, job *model.Job) (int64, error) {
	query := `
		INSERT INTO jobs (job_profile_id, team_id, scheduled_day, notes)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`
	var id int64
	err := r.db.QueryRowContext(
		ctx,
		query,
		job.JobProfileID,
		job.TeamID,
		job.ScheduledDay,
		job.Notes,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to create job: %w", err)
	}

	return id, nil
}

// GetByID retrieves a single job by its primary key ID
func (r *jobRepo) GetByID(ctx context.Context, id int64) (*model.Job, error) {
	query := `
		SELECT id, job_profile_id, team_id, scheduled_day, notes
		FROM jobs
		WHERE id = $1
	`
	var job model.Job
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&job.ID,
		&job.JobProfileID,
		&job.TeamID,
		&job.ScheduledDay,
		&job.Notes,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("job not found")
		}
		return nil, fmt.Errorf("failed to get job by id: %w", err)
	}

	return &job, nil
}

// GetAll retrieves a list of all jobs ordered by scheduled date
func (r *jobRepo) GetAll(ctx context.Context) ([]model.Job, error) {
	query := `
		SELECT id, job_profile_id, team_id, scheduled_day, notes
		FROM jobs
		ORDER BY scheduled_day ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query jobs: %w", err)
	}
	defer rows.Close()

	var jobs []model.Job
	for rows.Next() {
		var job model.Job
		if err := rows.Scan(
			&job.ID,
			&job.JobProfileID,
			&job.TeamID,
			&job.ScheduledDay,
			&job.Notes,
		); err != nil {
			return nil, fmt.Errorf("failed to scan job row: %w", err)
		}
		jobs = append(jobs, job)
	}

	return jobs, nil
}

// GetByMonthAndYear retrieves all jobs scheduled in a specific month and year
func (r *jobRepo) GetByMonthAndYear(ctx context.Context, month int, year int) ([]model.Job, error) {
	query := `
		SELECT id, job_profile_id, team_id, scheduled_day, notes
		FROM jobs
		WHERE EXTRACT(MONTH FROM scheduled_day) = $1 
		  AND EXTRACT(YEAR FROM scheduled_day) = $2
		ORDER BY scheduled_day ASC
	`
	rows, err := r.db.QueryContext(ctx, query, month, year)
	if err != nil {
		return nil, fmt.Errorf("failed to query jobs by month and year: %w", err)
	}
	defer rows.Close()

	var jobs []model.Job
	for rows.Next() {
		var job model.Job
		if err := rows.Scan(
			&job.ID,
			&job.JobProfileID,
			&job.TeamID,
			&job.ScheduledDay,
			&job.Notes,
		); err != nil {
			return nil, fmt.Errorf("failed to scan job row: %w", err)
		}
		jobs = append(jobs, job)
	}

	return jobs, nil
}

// Update modifies an existing job record by ID
func (r *jobRepo) Update(ctx context.Context, job *model.Job) error {
	query := `
		UPDATE jobs
		SET job_profile_id = $1, team_id = $2, scheduled_day = $3, notes = $4
		WHERE id = $5
	`
	result, err := r.db.ExecContext(
		ctx,
		query,
		job.JobProfileID,
		job.TeamID,
		job.ScheduledDay,
		job.Notes,
		job.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update job: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("job not found for update")
	}

	return nil
}

// Delete removes a job record by its ID
func (r *jobRepo) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM jobs WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete job: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("job not found for deletion")
	}

	return nil
}
