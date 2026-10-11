package http

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"cerm-api/internal/model"
)

type AmendApiHttpRepository interface {
	GetAll(ctx context.Context) ([]model.Service, error)
}

type amendApiHttpRepository struct {
	baseURL    string
	httpClient *http.Client
}

func NewAmendApiHttpRepository() AmendApiHttpRepository {
	url := os.Getenv("AMEND_API_URL")
	if url == "" {
		url = "http://api:3001"
	}

	return &amendApiHttpRepository{
		baseURL: url,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (r *amendApiHttpRepository) GetAll(ctx context.Context) ([]model.Service, error) {
	endpoint := fmt.Sprintf("%s/services/all", r.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request for services: %w", err)
	}
	req.Header.Set("Accept", "application/json")

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request for services: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code from services endpoint: %d", resp.StatusCode)
	}

	var services []model.Service
	if err := json.NewDecoder(resp.Body).Decode(&services); err != nil {
		return nil, fmt.Errorf("failed to decode services response: %w", err)
	}

	return services, nil
}
