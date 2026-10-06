package repository

import (
	"context"
	"database/sql"
	"fmt"

	"cerm-api/internal/model"
)

type CustomerProfileRepository interface {
	Create(ctx context.Context, profile *model.CustomerProfile) error
	Update(ctx context.Context, id string, profile *model.CustomerProfile) error
	GetByApproved(ctx context.Context, approved bool) ([]model.CustomerProfile, error)
	Delete(ctx context.Context, id string) error
}

type postgresCustomerProfileRepo struct {
	db *sql.DB
}

func NewCustomerProfileRepository(db *sql.DB) CustomerProfileRepository {
	return &postgresCustomerProfileRepo{db: db}
}

func (r *postgresCustomerProfileRepo) Create(ctx context.Context, profile *model.CustomerProfile) error {
	if len(profile.ServicesRequested) == 0 {
		profile.ServicesRequested = []byte("{}")
	}

	query := `
		INSERT INTO customer_profiles (
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
		return fmt.Errorf("failed to create customer profile: %w", err)
	}
	return nil
}

func (r *postgresCustomerProfileRepo) Update(ctx context.Context, id string, profile *model.CustomerProfile) error {
	if len(profile.ServicesRequested) == 0 {
		profile.ServicesRequested = []byte("{}")
	}

	query := `
		UPDATE customer_profiles SET
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
		return fmt.Errorf("failed to update customer profile: %w", err)
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

func (r *postgresCustomerProfileRepo) GetByApproved(ctx context.Context, approved bool) ([]model.CustomerProfile, error) {
	query := `
		SELECT id, name, email, phone_number, address, city, state, zip,
		       services_requested, scheduled_date, description, approved,
		       is_commercial, is_seen, referral_info, schedule, admin_notes, job_payout,
		       created_at, updated_at
		FROM customer_profiles
		WHERE approved = $1
		ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, approved)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch customer profiles: %w", err)
	}
	defer rows.Close()

	profiles := []model.CustomerProfile{}
	for rows.Next() {
		var p model.CustomerProfile
		err := rows.Scan(
			&p.ID, &p.Name, &p.Email, &p.PhoneNumber, &p.Address, &p.City,
			&p.State, &p.Zip, &p.ServicesRequested, &p.ScheduledDate,
			&p.Description, &p.Approved, &p.IsCommercial, &p.IsSeen,
			&p.ReferralInfo, &p.Schedule, &p.AdminNotes, &p.JobPayout,
			&p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan customer profile row: %w", err)
		}
		profiles = append(profiles, p)
	}
	return profiles, nil
}

func (r *postgresCustomerProfileRepo) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM customer_profiles WHERE id = $1`

	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete customer profile: %w", err)
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
