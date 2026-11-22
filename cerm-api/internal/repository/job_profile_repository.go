package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"cerm-api/internal/model"
)

type JobProfileRepository interface {
	Create(ctx context.Context, profile *model.JobProfile) error
	Update(ctx context.Context, id int64, profile *model.JobProfile) error
	GetAllApprovedWithLatestJob(
		ctx context.Context,
		limit int,
		offset int,
	) ([]JobProfileWithLastJob, int, error)
	GetUnapproved(ctx context.Context) ([]model.JobProfile, error)
	Delete(ctx context.Context, id int64) error
}

type postgresJobProfileRepo struct {
	db *sql.DB
}

type JobProfileWithLastJob struct {
	Profile          model.JobProfile
	LastScheduledDay *time.Time
}

func NewJobProfileRepository(db *sql.DB) JobProfileRepository {
	return &postgresJobProfileRepo{db: db}
}

func (r *postgresJobProfileRepo) Create(ctx context.Context, profile *model.JobProfile) error {
	if len(profile.ServicesRequested) == 0 {
		profile.ServicesRequested = []byte("{}")
	}

	query := `
        INSERT INTO job_profiles (
            name, email, phone_number, address, city, state, zip,
            services_requested, scheduled_date, description, approved,
            is_commercial, is_seen, referral_info, schedule, admin_notes, job_payout
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING id, created_at, updated_at`

	err := r.db.QueryRowContext(
		ctx, query,
		profile.Name, profile.Email, profile.PhoneNumber, profile.Address,
		profile.City, profile.State, profile.Zip, profile.ServicesRequested,
		profile.ScheduledDate, profile.Description, profile.Approved,
		profile.IsCommercial, profile.IsSeen, profile.ReferralInfo,
		profile.Schedule, profile.AdminNotes, profile.JobPayout,
	).Scan(&profile.ID, &profile.CreatedAt, &profile.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create job profile: %w", err)
	}
	return nil
}

func (r *postgresJobProfileRepo) Update(ctx context.Context, id int64, profile *model.JobProfile) error {
	if len(profile.ServicesRequested) == 0 {
		profile.ServicesRequested = []byte("{}")
	}

	query := `
        UPDATE job_profiles SET
            name = $1, email = $2, phone_number = $3, address = $4, city = $5,
            state = $6, zip = $7, services_requested = $8, scheduled_date = $9,
            description = $10, approved = $11, is_commercial = $12, is_seen = $13,
            referral_info = $14, schedule = $15, admin_notes = $16, job_payout = $17,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $18`

	res, err := r.db.ExecContext(
		ctx, query,
		profile.Name, profile.Email, profile.PhoneNumber, profile.Address,
		profile.City, profile.State, profile.Zip, profile.ServicesRequested,
		profile.ScheduledDate, profile.Description, profile.Approved,
		profile.IsCommercial, profile.IsSeen, profile.ReferralInfo,
		profile.Schedule, profile.AdminNotes, profile.JobPayout, id,
	)
	if err != nil {
		return fmt.Errorf("failed to update job profile: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *postgresJobProfileRepo) GetAllApprovedWithLatestJob(
	ctx context.Context,
	limit int,
	offset int,
) ([]JobProfileWithLastJob, int, error) {
	query := `
        WITH latest_jobs AS (
            SELECT DISTINCT ON (job_profile_id)
                   job_profile_id,
                   scheduled_day
            FROM jobs
            ORDER BY job_profile_id, id DESC
        )
        SELECT jp.id, jp.name, jp.email, jp.phone_number, jp.address, jp.city,
               jp.state, jp.zip, jp.services_requested, jp.scheduled_date,
               jp.description, jp.approved, jp.is_commercial, jp.is_seen,
               jp.referral_info, jp.schedule, jp.admin_notes, jp.job_payout,
               jp.created_at, jp.updated_at,
               lj.scheduled_day AS last_scheduled_day,
               COUNT(*) OVER() AS total_count
        FROM job_profiles jp
        LEFT JOIN latest_jobs lj ON lj.job_profile_id = jp.id
        WHERE jp.approved = true
        ORDER BY jp.created_at DESC, jp.id DESC
        LIMIT $1 OFFSET $2`

	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to fetch approved job profiles with latest job: %w", err)
	}
	defer rows.Close()

	results := make([]JobProfileWithLastJob, 0)
	var totalCount int

	for rows.Next() {
		var item JobProfileWithLastJob
		var lastScheduled sql.NullTime

		err := rows.Scan(
			&item.Profile.ID,
			&item.Profile.Name,
			&item.Profile.Email,
			&item.Profile.PhoneNumber,
			&item.Profile.Address,
			&item.Profile.City,
			&item.Profile.State,
			&item.Profile.Zip,
			&item.Profile.ServicesRequested,
			&item.Profile.ScheduledDate,
			&item.Profile.Description,
			&item.Profile.Approved,
			&item.Profile.IsCommercial,
			&item.Profile.IsSeen,
			&item.Profile.ReferralInfo,
			&item.Profile.Schedule,
			&item.Profile.AdminNotes,
			&item.Profile.JobPayout,
			&item.Profile.CreatedAt,
			&item.Profile.UpdatedAt,
			&lastScheduled,
			&totalCount,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan job profile with latest job: %w", err)
		}

		if lastScheduled.Valid {
			t := lastScheduled.Time
			item.LastScheduledDay = &t
		}

		results = append(results, item)
	}

	if err := rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("error iterating job profile rows: %w", err)
	}

	return results, totalCount, nil
}

func (r *postgresJobProfileRepo) GetUnapproved(ctx context.Context) ([]model.JobProfile, error) {
	query := `
        SELECT id, name, email, phone_number, address, city, state, zip,
               services_requested, scheduled_date, description, approved,
               is_commercial, is_seen, referral_info, schedule, admin_notes, job_payout,
               created_at, updated_at
        FROM job_profiles
        WHERE approved = false
        ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch unapproved job profiles: %w", err)
	}
	defer rows.Close()

	profiles := []model.JobProfile{}
	for rows.Next() {
		var p model.JobProfile
		err := rows.Scan(
			&p.ID, &p.Name, &p.Email, &p.PhoneNumber, &p.Address, &p.City,
			&p.State, &p.Zip, &p.ServicesRequested, &p.ScheduledDate,
			&p.Description, &p.Approved, &p.IsCommercial, &p.IsSeen,
			&p.ReferralInfo, &p.Schedule, &p.AdminNotes, &p.JobPayout,
			&p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan unapproved job profile row: %w", err)
		}
		profiles = append(profiles, p)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating unapproved job profile rows: %w", err)
	}

	return profiles, nil
}

func (r *postgresJobProfileRepo) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM job_profiles WHERE id = $1`

	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete job profile: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
