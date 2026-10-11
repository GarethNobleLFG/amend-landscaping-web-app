package service

import (
	"context"

	"cerm-api/internal/model"
	repository "cerm-api/internal/repository/http"
)

type AmendApiService interface {
	GetAllServices(ctx context.Context) ([]model.Service, error)
}

type amendApiService struct {
	repo repository.AmendApiHttpRepository
}

func NewAmendApiService(repo repository.AmendApiHttpRepository) AmendApiService {
	return &amendApiService{repo: repo}
}

func (s *amendApiService) GetAllServices(ctx context.Context) ([]model.Service, error) {
	return s.repo.GetAll(ctx)
}
