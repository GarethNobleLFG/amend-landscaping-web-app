package model

import (
	"encoding/json"
	"time"
)

type CustomerProfile struct {
	ID                string          `json:"id" db:"id"`
	Name              string          `json:"name" db:"name"`
	Email             string          `json:"email" db:"email"`
	PhoneNumber       string          `json:"phone_number" db:"phone_number"`
	Address           string          `json:"address" db:"address"`
	City              string          `json:"city" db:"city"`
	State             string          `json:"state" db:"state"`
	Zip               string          `json:"zip" db:"zip"`
	ServicesRequested json.RawMessage `json:"services_requested" db:"services_requested"`
	ScheduledDate     *time.Time      `json:"scheduled_date,omitempty" db:"scheduled_date"`
	Description       *string         `json:"description,omitempty" db:"description"`
	Approved          bool            `json:"approved" db:"approved"`
	IsCommercial      bool            `json:"is_commercial" db:"is_commercial"`
	IsSeen            bool            `json:"is_seen" db:"is_seen"`
	ReferralInfo      *string         `json:"referral_info,omitempty" db:"referral_info"`
	Schedule          *string         `json:"schedule,omitempty" db:"schedule"`
	AdminNotes        *string         `json:"admin_notes,omitempty" db:"admin_notes"`
	JobPayout         *float64        `json:"job_payout,omitempty" db:"job_payout"`
	CreatedAt         time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time       `json:"updated_at" db:"updated_at"`
}
