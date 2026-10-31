package repository

import (
	"context"
	"database/sql"
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
	ID             int64             `json:"id"`
	JobProfileID   int64             `json:"job_profile_id"`
	TeamID         *int64            `json:"team_id"`
	ScheduledDay   time.Time         `json:"scheduled_day"`
	StartTime      *time.Time        `json:"start_time"`
	EndTime        *time.Time        `json:"end_time"`
	Completed      bool              `json:"completed"`
	Notes          *string           `json:"notes"`
	CompletedNotes *string           `json:"completed_notes,omitempty"`
	JobProfile     *model.JobProfile `json:"job_profile,omitempty"`
}

func NewJobRepository(db *sql.DB) JobRepository {
	return &jobRepo{db: db}
}

// Create inserts a new job record and returns its generated ID
func (r *jobRepo) Create(ctx context.Context, job *model.Job) (int64, error) {
	query := `
        INSERT INTO jobs (job_profile_id, team_id, scheduled_day, start_time, end_time, completed, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `
	var id int64
	err := r.db.QueryRowContext(
		ctx,
		query,
		job.JobProfileID,
		job.TeamID,
		job.ScheduledDay,
		job.StartTime,
		job.EndTime,
		job.Completed,
		job.Notes,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("failed to create job: %w", err)
	}

	return id, nil
}

// GetByID retrieves a single job by its primary key ID
func (r *jobRepo) GetByID(ctx context.Context, id int64) (*JobWithProfile, error) {
	query := `
        SELECT 
            j.id, j.job_profile_id, j.team_id, j.scheduled_day, j.start_time, j.end_time, j.completed, j.notes,
            p.id, p.name, p.email, p.phone_number, p.address, p.city, p.state, p.zip,
            p.services_requested, p.scheduled_date, p.description, p.approved, 
            p.is_commercial, p.is_seen, p.referral_info, p.schedule, p.admin_notes, 
            p.job_payout, p.created_at, p.updated_at
        FROM jobs j
        LEFT JOIN job_profiles p ON j.job_profile_id = p.id
        WHERE j.id = $1
    `

	var res JobWithProfile
	var profile model.JobProfile

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&res.ID,
		&res.JobProfileID,
		&res.TeamID,
		&res.ScheduledDay,
		&res.StartTime,
		&res.EndTime,
		&res.Completed,
		&res.Notes,
		&profile.ID,
		&profile.Name,
		&profile.Email,
		&profile.PhoneNumber,
		&profile.Address,
		&profile.City,
		&profile.State,
		&profile.Zip,
		&profile.ServicesRequested,
		&profile.ScheduledDate,
		&profile.Description,
		&profile.Approved,
		&profile.IsCommercial,
		&profile.IsSeen,
		&profile.ReferralInfo,
		&profile.Schedule,
		&profile.AdminNotes,
		&profile.JobPayout,
		&profile.CreatedAt,
		&profile.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("job not found")
		}
		return nil, fmt.Errorf("failed to get job by id: %w", err)
	}

	res.JobProfile = &profile
	return &res, nil
}

// GetAll retrieves all jobs ordered by scheduled date along with associated job profile fields
func (r *jobRepo) GetAll(ctx context.Context) ([]JobWithProfile, error) {
	query := `
        SELECT 
            j.id, j.job_profile_id, j.team_id, j.scheduled_day, j.start_time, j.end_time, j.completed, j.notes,
            p.id, p.name, p.email, p.phone_number, p.address, p.city, p.state, p.zip,
            p.services_requested, p.scheduled_date, p.description, p.approved, 
            p.is_commercial, p.is_seen, p.referral_info, p.schedule, p.admin_notes, 
            p.job_payout, p.created_at, p.updated_at
        FROM jobs j
        LEFT JOIN job_profiles p ON j.job_profile_id = p.id
        ORDER BY j.scheduled_day ASC
    `

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query jobs: %w", err)
	}
	defer rows.Close()

	var jobs []JobWithProfile
	for rows.Next() {
		var res JobWithProfile
		var profile model.JobProfile

		if err := rows.Scan(
			&res.ID,
			&res.JobProfileID,
			&res.TeamID,
			&res.ScheduledDay,
			&res.StartTime,
			&res.EndTime,
			&res.Completed,
			&res.Notes,
			&profile.ID,
			&profile.Name,
			&profile.Email,
			&profile.PhoneNumber,
			&profile.Address,
			&profile.City,
			&profile.State,
			&profile.Zip,
			&profile.ServicesRequested,
			&profile.ScheduledDate,
			&profile.Description,
			&profile.Approved,
			&profile.IsCommercial,
			&profile.IsSeen,
			&profile.ReferralInfo,
			&profile.Schedule,
			&profile.AdminNotes,
			&profile.JobPayout,
			&profile.CreatedAt,
			&profile.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan job row: %w", err)
		}

		res.JobProfile = &profile
		jobs = append(jobs, res)
	}

	return jobs, nil
}

// GetByMonthAndYear retrieves all jobs scheduled in a specific month and year with job profile fields
func (r *jobRepo) GetByMonthAndYear(ctx context.Context, month int, year int) ([]JobWithProfile, error) {
	query := `
        SELECT 
            j.id, j.job_profile_id, j.team_id, j.scheduled_day, j.start_time, j.end_time, j.completed, j.notes, j.completed_notes,
            p.id, p.name, p.email, p.phone_number, p.address, p.city, p.state, p.zip,
            p.services_requested, p.scheduled_date, p.description, p.approved, 
            p.is_commercial, p.is_seen, p.referral_info, p.schedule, p.admin_notes, 
            p.job_payout, p.created_at, p.updated_at
        FROM jobs j
        LEFT JOIN job_profiles p ON j.job_profile_id = p.id
        WHERE EXTRACT(MONTH FROM j.scheduled_day) = $1 
          AND EXTRACT(YEAR FROM j.scheduled_day) = $2
        ORDER BY j.scheduled_day ASC
    `

	rows, err := r.db.QueryContext(ctx, query, month, year)
	if err != nil {
		return nil, fmt.Errorf("failed to query jobs by month and year: %w", err)
	}
	defer rows.Close()

	var jobs []JobWithProfile
	for rows.Next() {
		var res JobWithProfile
		var profile model.JobProfile

		if err := rows.Scan(
			&res.ID,
			&res.JobProfileID,
			&res.TeamID,
			&res.ScheduledDay,
			&res.StartTime,
			&res.EndTime,
			&res.Completed,
			&res.Notes,
			&res.CompletedNotes,
			&profile.ID,
			&profile.Name,
			&profile.Email,
			&profile.PhoneNumber,
			&profile.Address,
			&profile.City,
			&profile.State,
			&profile.Zip,
			&profile.ServicesRequested,
			&profile.ScheduledDate,
			&profile.Description,
			&profile.Approved,
			&profile.IsCommercial,
			&profile.IsSeen,
			&profile.ReferralInfo,
			&profile.Schedule,
			&profile.AdminNotes,
			&profile.JobPayout,
			&profile.CreatedAt,
			&profile.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan job row: %w", err)
		}

		res.JobProfile = &profile
		jobs = append(jobs, res)
	}

	return jobs, nil
}

// GetByWeekAndTeam fetches jobs scheduled for a specific team within an inclusive date range [startDate, endDate]
func (r *jobRepo) GetByWeekAndTeam(ctx context.Context, teamID int64, startDate time.Time, endDate time.Time) ([]JobWithProfile, error) {
	query := `
        SELECT 
            j.id, j.job_profile_id, j.team_id, j.scheduled_day, j.start_time, j.end_time, j.completed, j.notes,
            p.id, p.name, p.email, p.phone_number, p.address, p.city, p.state, p.zip,
            p.services_requested, p.scheduled_date, p.description, p.approved, 
            p.is_commercial, p.is_seen, p.referral_info, p.schedule, p.admin_notes, 
            p.job_payout, p.created_at, p.updated_at
        FROM jobs j
        LEFT JOIN job_profiles p ON j.job_profile_id = p.id
        WHERE j.team_id = $1 
          AND j.scheduled_day >= $2 
          AND j.scheduled_day <= $3
        ORDER BY j.scheduled_day ASC
    `

	rows, err := r.db.QueryContext(ctx, query, teamID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query weekly jobs by team: %w", err)
	}
	defer rows.Close()

	var jobs []JobWithProfile
	for rows.Next() {
		var res JobWithProfile
		var profile model.JobProfile

		if err := rows.Scan(
			&res.ID,
			&res.JobProfileID,
			&res.TeamID,
			&res.ScheduledDay,
			&res.StartTime,
			&res.EndTime,
			&res.Completed,
			&res.Notes,
			&profile.ID,
			&profile.Name,
			&profile.Email,
			&profile.PhoneNumber,
			&profile.Address,
			&profile.City,
			&profile.State,
			&profile.Zip,
			&profile.ServicesRequested,
			&profile.ScheduledDate,
			&profile.Description,
			&profile.Approved,
			&profile.IsCommercial,
			&profile.IsSeen,
			&profile.ReferralInfo,
			&profile.Schedule,
			&profile.AdminNotes,
			&profile.JobPayout,
			&profile.CreatedAt,
			&profile.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan weekly job row: %w", err)
		}

		res.JobProfile = &profile
		jobs = append(jobs, res)
	}

	return jobs, nil
}

// Update modifies an existing job record by ID
func (r *jobRepo) Update(ctx context.Context, job *model.Job) error {
	query := `
        UPDATE jobs
        SET job_profile_id = $1, team_id = $2, scheduled_day = $3, start_time = $4, end_time = $5, completed = $6, notes = $7, completed_notes = $8
        WHERE id = $9
    `
	result, err := r.db.ExecContext(
		ctx,
		query,
		job.JobProfileID,
		job.TeamID,
		job.ScheduledDay,
		job.StartTime,
		job.EndTime,
		job.Completed,
		job.Notes,
		job.CompletedNotes,
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
