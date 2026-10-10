package service

import (
	"context"
	"errors"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
)

type CustomerProfileService interface {
	CreateCustomerProfile(ctx context.Context, profile *model.CustomerProfile) error
	UpdateCustomerProfile(ctx context.Context, id int64, profile *model.CustomerProfile) error
	GetApprovedProfiles(ctx context.Context) ([]model.CustomerProfile, error)
	GetUnapprovedProfiles(ctx context.Context) ([]model.CustomerProfile, error)
	DeleteCustomerProfile(ctx context.Context, id int64) error
}

type customerProfileService struct {
	repo repository.CustomerProfileRepository
}

func NewCustomerProfileService(repo repository.CustomerProfileRepository) CustomerProfileService {
	return &customerProfileService{repo: repo}
}

func (s *customerProfileService) CreateCustomerProfile(ctx context.Context, profile *model.CustomerProfile) error {
	if profile.Name == "" || profile.Email == "" {
		return errors.New("name and email are required fields")
	}
	return s.repo.Create(ctx, profile)
}

func (s *customerProfileService) UpdateCustomerProfile(ctx context.Context, id int64, profile *model.CustomerProfile) error {
	if id == 0 {
		return errors.New("invalid customer profile ID")
	}
	return s.repo.Update(ctx, id, profile)
}

func (s *customerProfileService) GetApprovedProfiles(ctx context.Context) ([]model.CustomerProfile, error) {
	return s.repo.GetByApproved(ctx, true)
}

func (s *customerProfileService) GetUnapprovedProfiles(ctx context.Context) ([]model.CustomerProfile, error) {
	return s.repo.GetByApproved(ctx, false)
}

func (s *customerProfileService) DeleteCustomerProfile(ctx context.Context, id int64) error {
	if id == 0 {
		return errors.New("invalid customer profile ID")
	}
	return s.repo.Delete(ctx, id)
}
