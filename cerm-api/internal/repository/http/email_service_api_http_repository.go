package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"cerm-api/pkg/utils"
)

type EmailRepository interface {
	SendApprovalEmail(payload utils.EmailAppointmentPayload, customMessage string) error
	SendDenialEmail(payload utils.EmailAppointmentPayload, customMessage string) error
}

type httpEmailRepository struct {
	baseURL    string
	httpClient *http.Client
}

func NewHTTPEmailRepository() EmailRepository {
	baseURL := os.Getenv("EMAIL_SERVICE_API_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3000"
	}

	return &httpEmailRepository{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type approvalRequestPayload struct {
	Appointment   utils.EmailAppointmentPayload `json:"appointment"`
	CustomMessage string                        `json:"custom_message"`
}

type denialRequestPayload struct {
	Appointment   utils.EmailAppointmentPayload `json:"appointment"`
	CustomMessage string                        `json:"custom_message"`
}

func (r *httpEmailRepository) SendApprovalEmail(payload utils.EmailAppointmentPayload, customMessage string) error {
	url := fmt.Sprintf("%s/api/emails/approve", r.baseURL)

	reqPayload := approvalRequestPayload{
		Appointment:   payload,
		CustomMessage: customMessage,
	}

	bodyBytes, err := json.Marshal(reqPayload)
	if err != nil {
		return fmt.Errorf("failed to marshal approval payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return fmt.Errorf("failed to create approval HTTP request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send approval email request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("email service returned non-200 status for approval: %d", resp.StatusCode)
	}

	return nil
}

func (r *httpEmailRepository) SendDenialEmail(payload utils.EmailAppointmentPayload, customMessage string) error {
	url := fmt.Sprintf("%s/api/emails/deny", r.baseURL)

	reqPayload := denialRequestPayload{
		Appointment:   payload,
		CustomMessage: customMessage,
	}

	bodyBytes, err := json.Marshal(reqPayload)
	if err != nil {
		return fmt.Errorf("failed to marshal denial payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return fmt.Errorf("failed to create denial HTTP request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send denial email request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("email service returned non-200 status for denial: %d", resp.StatusCode)
	}

	return nil
}
