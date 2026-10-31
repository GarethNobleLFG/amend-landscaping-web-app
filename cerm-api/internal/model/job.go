package model

import (
	"time"
)

type Job struct {
	ID           int64      `json:"id" db:"id"`
	JobProfileID int64      `json:"job_profile_id" db:"job_profile_id"`
	TeamID       *int64     `json:"team_id,omitempty" db:"team_id"`
	ScheduledDay time.Time  `json:"scheduled_day" db:"scheduled_day"`
	StartTime    *time.Time `json:"start_time,omitempty" db:"start_time"`
	EndTime      *time.Time `json:"end_time,omitempty" db:"end_time"`
	Completed    bool       `json:"completed" db:"completed"`
	Notes        *string    `json:"notes,omitempty" db:"notes"`
}
