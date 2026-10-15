package repository

import (
	"context"
	"database/sql"
	"fmt"

	"cerm-api/internal/model"
)

type JobProfileRepository interface {
	Create(ctx context.Context, profile *model.JobProfile) error
	Update(ctx context.Context, id int64, profile *model.JobProfile) error
	GetByApproved(ctx context.Context, approved bool) ([]model.JobProfile, error)
	Delete(ctx context.Context, id int64) error
}

type postgresJobProfileRepo struct {
	db *sql.DB
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
            is_commercial, is_seen, referral_info, admin_notes, job_payout
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) RETURNING id, created_at, updated_at`

	err := r.db.QueryRowContext(
		ctx, query,
		profile.Name, profile.Email, profile.PhoneNumber, profile.Address,
		profile.City, profile.State, profile.Zip, profile.ServicesRequested,
		profile.ScheduledDate, profile.Description, profile.Approved,
		profile.IsCommercial, profile.IsSeen, profile.ReferralInfo,
		profile.AdminNotes, profile.JobPayout,
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
            referral_info = $14, admin_notes = $15, job_payout = $16,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $17`

	res, err := r.db.ExecContext(
		ctx, query,
		profile.Name, profile.Email, profile.PhoneNumber, profile.Address,
		profile.City, profile.State, profile.Zip, profile.ServicesRequested,
		profile.ScheduledDate, profile.Description, profile.Approved,
		profile.IsCommercial, profile.IsSeen, profile.ReferralInfo,
		profile.AdminNotes, profile.JobPayout, id,
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

func (r *postgresJobProfileRepo) GetByApproved(ctx context.Context, approved bool) ([]model.JobProfile, error) {
	query := `
        SELECT id, name, email, phone_number, address, city, state, zip,
               services_requested, scheduled_date, description, approved,
               is_commercial, is_seen, referral_info, admin_notes, job_payout,
               created_at, updated_at
        FROM job_profiles
        WHERE approved = $1
        ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, approved)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch job profiles: %w", err)
	}
	defer rows.Close()

	profiles := []model.JobProfile{}
	for rows.Next() {
		var p model.JobProfile
		err := rows.Scan(
			&p.ID, &p.Name, &p.Email, &p.PhoneNumber, &p.Address, &p.City,
			&p.State, &p.Zip, &p.ServicesRequested, &p.ScheduledDate,
			&p.Description, &p.Approved, &p.IsCommercial, &p.IsSeen,
			&p.ReferralInfo, &p.AdminNotes, &p.JobPayout,
			&p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan job profile row: %w", err)
		}
		profiles = append(profiles, p)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating job profile rows: %w", err)
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
