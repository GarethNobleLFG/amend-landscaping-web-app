package service

import (
	"context"
	"errors"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
)

type JobProfileService interface {
	CreateJobProfile(ctx context.Context, profile *model.JobProfile) error
	UpdateJobProfile(ctx context.Context, id int64, profile *model.JobProfile) error
	GetApprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error)
	GetUnapprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error)
	DeleteJobProfile(ctx context.Context, id int64) error
}

type jobProfileService struct {
	repo repository.JobProfileRepository
}

func NewJobProfileService(repo repository.JobProfileRepository) JobProfileService {
	return &jobProfileService{repo: repo}
}

func (s *jobProfileService) CreateJobProfile(ctx context.Context, profile *model.JobProfile) error {
	if profile.Name == "" || profile.Email == "" {
		return errors.New("name and email are required fields")
	}
	return s.repo.Create(ctx, profile)
}

func (s *jobProfileService) UpdateJobProfile(ctx context.Context, id int64, profile *model.JobProfile) error {
	if id == 0 {
		return errors.New("invalid job profile ID")
	}
	return s.repo.Update(ctx, id, profile)
}

func (s *jobProfileService) GetApprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error) {
	return s.repo.GetByApproved(ctx, true)
}

func (s *jobProfileService) GetUnapprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error) {
	return s.repo.GetByApproved(ctx, false)
}

func (s *jobProfileService) DeleteJobProfile(ctx context.Context, id int64) error {
	if id == 0 {
		return errors.New("invalid job profile ID")
	}
	return s.repo.Delete(ctx, id)
}
