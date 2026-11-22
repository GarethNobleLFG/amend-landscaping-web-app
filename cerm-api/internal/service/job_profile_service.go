package service

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"time"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
	"cerm-api/pkg/utils"
)

type JobProfileService interface {
	CreateJobProfile(ctx context.Context, profile *model.JobProfile) error
	UpdateJobProfile(ctx context.Context, id int64, profile *model.JobProfile) error
	GetAllApprovedProfilesWithLatestJob(ctx context.Context, limit int, offset int) (PaginatedApprovedJobProfilesResponse, error)
	GetUnapprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error)
	DeleteJobProfile(ctx context.Context, id int64) error
}

type jobProfileService struct {
	repo repository.JobProfileRepository
}

type ApprovedJobProfileItem struct {
	Profile          model.JobProfile `json:"profile"`
	DaysSinceLastJob *int             `json:"days_since_last_job"` // nil if no job or future scheduled_day
	HasNoJobs        bool             `json:"has_no_jobs"`         // true when no job record exists for the profile
}

type PaginatedApprovedJobProfilesResponse struct {
	Items      []ApprovedJobProfileItem `json:"items"`
	TotalCount int                      `json:"total_count"`
	Limit      int                      `json:"limit"`
	Offset     int                      `json:"offset"`
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

func (s *jobProfileService) GetAllApprovedProfilesWithLatestJob(
	ctx context.Context,
	limit int,
	offset int,
) (PaginatedApprovedJobProfilesResponse, error) {
	rawItems, totalCount, err := s.repo.GetAllApprovedWithLatestJob(ctx, limit, offset)
	if err != nil {
		return PaginatedApprovedJobProfilesResponse{}, fmt.Errorf("failed to fetch approved job profiles with latest job: %w", err)
	}

	now := time.Now()
	items := make([]ApprovedJobProfileItem, 0, len(rawItems))
	for _, raw := range rawItems {
		hasNoJobs := raw.LastScheduledDay == nil

		var daysSinceLastJob *int
		if !hasNoJobs {
			daysSinceLastJob = utils.CalculateDaysSinceLastJob(raw.LastScheduledDay, now)
		}

		items = append(items, ApprovedJobProfileItem{
			Profile:          raw.Profile,
			DaysSinceLastJob: daysSinceLastJob,
			HasNoJobs:        hasNoJobs,
		})
	}

	sort.SliceStable(items, func(i, j int) bool {
		a := items[i].DaysSinceLastJob
		b := items[j].DaysSinceLastJob

		if a == nil && b == nil {
			return false
		}
		if a == nil {
			return false
		}
		if b == nil {
			return true
		}
		return *a > *b
	})

	return PaginatedApprovedJobProfilesResponse{
		Items:      items,
		TotalCount: totalCount,
		Limit:      limit,
		Offset:     offset,
	}, nil
}

func (s *jobProfileService) GetUnapprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error) {
	return s.repo.GetUnapproved(ctx)
}

func (s *jobProfileService) DeleteJobProfile(ctx context.Context, id int64) error {
	if id == 0 {
		return errors.New("invalid job profile ID")
	}
	return s.repo.Delete(ctx, id)
}
