package model

import (
	"encoding/json"
	"time"
)

type Job struct {
	ID                int64           `json:"id" db:"id"`
	TeamID            *int64          `json:"team_id,omitempty" db:"team_id"`
	Name              *string         `json:"name,omitempty" db:"name"`
	Email             *string         `json:"email,omitempty" db:"email"`
	PhoneNumber       *string         `json:"phone_number,omitempty" db:"phone_number"`
	Address           *string         `json:"address,omitempty" db:"address"`
	JobPayout         *float64        `json:"job_payout,omitempty" db:"job_payout"`
	ScheduledDay      time.Time       `json:"scheduled_day" db:"scheduled_day"`
	StartTime         *time.Time      `json:"start_time,omitempty" db:"start_time"`
	EndTime           *time.Time      `json:"end_time,omitempty" db:"end_time"`
	Completed         bool            `json:"completed" db:"completed"`
	Notes             *string         `json:"notes,omitempty" db:"notes"`
	CompletedNotes    *string         `json:"completed_notes,omitempty" db:"completed_notes"`
	ServicesRequested json.RawMessage `json:"services_requested" db:"services_requested"`
}
