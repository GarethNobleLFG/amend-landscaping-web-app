package model

type Appointment struct {
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
