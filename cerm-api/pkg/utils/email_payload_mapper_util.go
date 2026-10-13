package utils

import (
	"cerm-api/internal/model"
	"time"
)

// EmailAppointmentPayload matches the exact JSON structure expected by the email microservice
type EmailAppointmentPayload struct {
	Name              string      `json:"name"`
	Email             string      `json:"email"`
	Address           string      `json:"address"`
	IsCommercial      bool        `json:"is_commercial"`
	ScheduledDate     *string     `json:"scheduled_date"`
	CreatedAt         string      `json:"created_at"`
	Notes             *string     `json:"notes"`
	ServicesRequested interface{} `json:"services_requested"`
	PhoneNumber       *string     `json:"phone_number"`
	City              *string     `json:"city"`
	State             *string     `json:"state"`
	Zip               *string     `json:"zip"`
	Description       *string     `json:"description"`
}

// MapJobProfileToEmailPayload converts a JobProfile into the email service payload format
func MapJobProfileToEmailPayload(profile model.JobProfile) EmailAppointmentPayload {
	var scheduledDateStr *string
	if profile.ScheduledDate != nil {
		formatted := profile.ScheduledDate.Format(time.RFC3339)
		scheduledDateStr = &formatted
	}

	var phone *string
	if profile.PhoneNumber != "" {
		phone = &profile.PhoneNumber
	}

	var city *string
	if profile.City != "" {
		city = &profile.City
	}

	var state *string
	if profile.State != "" {
		state = &profile.State
	}

	var zip *string
	if profile.Zip != "" {
		zip = &profile.Zip
	}

	return EmailAppointmentPayload{
		Name:              profile.Name,
		Email:             profile.Email,
		Address:           profile.Address,
		IsCommercial:      profile.IsCommercial,
		ScheduledDate:     scheduledDateStr,
		CreatedAt:         profile.CreatedAt.Format(time.RFC3339),
		Notes:             profile.Description,
		Description:       profile.Description,
		ServicesRequested: profile.ServicesRequested,
		PhoneNumber:       phone,
		City:              city,
		State:             state,
		Zip:               zip,
	}
}
