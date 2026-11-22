package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"cerm-api/internal/model"
)

type JobRepository interface {
	Create(ctx context.Context, job *model.Job) (int64, error)
	GetByID(ctx context.Context, id int64) (*JobWithProfile, error)
	GetAll(ctx context.Context) ([]JobWithProfile, error)
	GetByMonthAndYear(ctx context.Context, month int, year int) ([]JobWithProfile, error)
	GetByWeekAndTeam(ctx context.Context, teamID int64, startDate time.Time, endDate time.Time) ([]JobWithProfile, error)
	Update(ctx context.Context, job *model.Job) error
	Delete(ctx context.Context, id int64) error
}

type jobRepo struct {
	db *sql.DB
}

type JobWithProfile struct {
	ID                int64           `json:"id"`
	TeamID            *int64          `json:"team_id,omitempty"`
	Name              *string         `json:"name,omitempty"`
	Email             *string         `json:"email,omitempty"`
	PhoneNumber       *string         `json:"phone_number,omitempty"`
	Address           *string         `json:"address,omitempty"`
	JobPayout         *float64        `json:"job_payout,omitempty"`
	ScheduledDay      time.Time       `json:"scheduled_day"`
	StartTime         *time.Time      `json:"start_time,omitempty"`
	EndTime           *time.Time      `json:"end_time,omitempty"`
	Completed         bool            `json:"completed"`
	Notes             *string         `json:"notes,omitempty"`
	CompletedNotes    *string         `json:"completed_notes,omitempty"`
	ServicesRequested json.RawMessage `json:"services_requested"`
}

func NewJobRepository(db *sql.DB) JobRepository {
	return &jobRepo{db: db}
}

const jobSelectColumns = `
	id, team_id, name, email, phone_number, address, job_payout,
	scheduled_day, start_time, end_time, completed, notes, completed_notes, services_requested
`

type rowScanner interface {
	Scan(dest ...any) error
}

func scanJobRow(scanner rowScanner) (JobWithProfile, error) {
	var res JobWithProfile
	err := scanner.Scan(
		&res.ID,
		&res.TeamID,
		&res.Name,
		&res.Email,
		&res.PhoneNumber,
		&res.Address,
		&res.JobPayout,
		&res.ScheduledDay,
		&res.StartTime,
		&res.EndTime,
		&res.Completed,
		&res.Notes,
		&res.CompletedNotes,
		&res.ServicesRequested,
	)
	return res, err
}

// Create inserts a new job record and returns its generated ID
func (r *jobRepo) Create(ctx context.Context, job *model.Job) (int64, error) {
	if len(job.ServicesRequested) == 0 {
		job.ServicesRequested = []byte("{}")
	}

	query := `
		INSERT INTO jobs (
			team_id, name, email, phone_number, address, job_payout,
			scheduled_day, start_time, end_time, completed, notes, services_requested
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
	`
	var id int64
	err := r.db.QueryRowContext(
		ctx,
		query,
		job.TeamID,
		job.Name,
		job.Email,
		job.PhoneNumber,
		job.Address,
		job.JobPayout,
		job.ScheduledDay,
		job.StartTime,
		job.EndTime,
		job.Completed,
		job.Notes,
		job.ServicesRequested,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to create job: %w", err)
	}

	return id, nil
}

// GetByID retrieves a single job by its primary key ID
func (r *jobRepo) GetByID(ctx context.Context, id int64) (*JobWithProfile, error) {
	query := fmt.Sprintf(`
		SELECT %s
		FROM jobs
		WHERE id = $1
	`, jobSelectColumns)

	res, err := scanJobRow(r.db.QueryRowContext(ctx, query, id))
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("job not found")
		}
		return nil, fmt.Errorf("failed to get job by id: %w", err)
	}

	return &res, nil
}

// GetAll retrieves all jobs ordered by scheduled date
func (r *jobRepo) GetAll(ctx context.Context) ([]JobWithProfile, error) {
	query := fmt.Sprintf(`
		SELECT %s
		FROM jobs
		ORDER BY scheduled_day ASC
	`, jobSelectColumns)

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query jobs: %w", err)
	}
	defer rows.Close()

	var jobs []JobWithProfile
	for rows.Next() {
		res, err := scanJobRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan job row: %w", err)
		}
		jobs = append(jobs, res)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating job rows: %w", err)
	}

	return jobs, nil
}

// GetByMonthAndYear retrieves all jobs scheduled in a specific month and year
func (r *jobRepo) GetByMonthAndYear(ctx context.Context, month int, year int) ([]JobWithProfile, error) {
	query := fmt.Sprintf(`
		SELECT %s
		FROM jobs
		WHERE EXTRACT(MONTH FROM scheduled_day) = $1
		  AND EXTRACT(YEAR FROM scheduled_day) = $2
		ORDER BY scheduled_day ASC
	`, jobSelectColumns)

	rows, err := r.db.QueryContext(ctx, query, month, year)
	if err != nil {
		return nil, fmt.Errorf("failed to query jobs by month and year: %w", err)
	}
	defer rows.Close()

	var jobs []JobWithProfile
	for rows.Next() {
		res, err := scanJobRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan job row: %w", err)
		}
		jobs = append(jobs, res)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating job rows: %w", err)
	}

	return jobs, nil
}

// GetByWeekAndTeam fetches jobs scheduled for a specific team within an inclusive date range [startDate, endDate]
func (r *jobRepo) GetByWeekAndTeam(ctx context.Context, teamID int64, startDate time.Time, endDate time.Time) ([]JobWithProfile, error) {
	query := fmt.Sprintf(`
		SELECT %s
		FROM jobs
		WHERE team_id = $1
		  AND scheduled_day >= $2
		  AND scheduled_day <= $3
		ORDER BY scheduled_day ASC
	`, jobSelectColumns)

	rows, err := r.db.QueryContext(ctx, query, teamID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query weekly jobs by team: %w", err)
	}
	defer rows.Close()

	var jobs []JobWithProfile
	for rows.Next() {
		res, err := scanJobRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan weekly job row: %w", err)
		}
		jobs = append(jobs, res)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating job rows: %w", err)
	}

	return jobs, nil
}

// Update modifies an existing job record by ID
func (r *jobRepo) Update(ctx context.Context, job *model.Job) error {
	if len(job.ServicesRequested) == 0 {
		job.ServicesRequested = []byte("{}")
	}

	query := `
		UPDATE jobs
		SET team_id = $1,
		    name = $2,
		    email = $3,
		    phone_number = $4,
		    address = $5,
		    job_payout = $6,
		    scheduled_day = $7,
		    start_time = $8,
		    end_time = $9,
		    completed = $10,
		    notes = $11,
		    completed_notes = $12,
		    services_requested = $13
		WHERE id = $14
	`
	result, err := r.db.ExecContext(
		ctx,
		query,
		job.TeamID,
		job.Name,
		job.Email,
		job.PhoneNumber,
		job.Address,
		job.JobPayout,
		job.ScheduledDay,
		job.StartTime,
		job.EndTime,
		job.Completed,
		job.Notes,
		job.CompletedNotes,
		job.ServicesRequested,
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
