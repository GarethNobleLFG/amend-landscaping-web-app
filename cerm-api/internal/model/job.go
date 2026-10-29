package model

import (
	"time"
)

type Job struct {
	ID           int64     `json:"id" db:"id"`
	JobProfileID int64     `json:"job_profile_id" db:"job_profile_id"`
	TeamID       *int64    `json:"team_id,omitempty" db:"team_id"`
	ScheduledDay time.Time `json:"scheduled_day" db:"scheduled_day"`
	Notes        *string   `json:"notes,omitempty" db:"notes"`
}
