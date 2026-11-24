package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"sort"
	"strings"
	"time"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
	"cerm-api/pkg/utils"
)

type JobProfileService interface {
	CreateJobProfile(ctx context.Context, profile *model.JobProfile) error
	GetJobProfileByID(ctx context.Context, id int64) (*model.JobProfile, error)
	UpdateJobProfile(ctx context.Context, id int64, profile *model.JobProfile) error
	GetAllApprovedProfilesWithLatestJob(ctx context.Context, limit int, offset int) (PaginatedApprovedJobProfilesResponse, error)
	GetUnapprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error)
	SearchApprovedProfilesWithLatestJob(ctx context.Context, nameQuery string, profileType string, limit int, offset int) (PaginatedApprovedJobProfilesResponse, error)
	SearchApprovedJobProfilesByName(ctx context.Context, nameQuery string, limit int, offset int) (PaginatedJobProfilesResponse, error)
	DeleteJobProfile(ctx context.Context, id int64) error
}

type PaginatedJobProfilesResponse struct {
	Items      []model.JobProfile `json:"items"`
	TotalCount int                `json:"total_count"`
	Limit      int                `json:"limit"`
	Offset     int                `json:"offset"`
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

func (s *jobProfileService) GetJobProfileByID(ctx context.Context, id int64) (*model.JobProfile, error) {
	if id <= 0 {
		return nil, errors.New("invalid job profile ID")
	}

	profile, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("job profile not found: %w", err)
		}
		return nil, fmt.Errorf("failed to get job profile by id: %w", err)
	}

	return profile, nil
}

func jobProfileSortTier(item ApprovedJobProfileItem) int {
	if item.DaysSinceLastJob != nil {
		return 0 // 1. Has days count (sorted highest first)
	}
	if item.HasNoJobs {
		return 1 // 2. Days is nil and never scheduled (HasNoJobs == true)
	}
	return 2 // 3. Days is nil and HasNoJobs == false (e.g., future scheduled job)
}

func buildApprovedJobProfileItems(
	rawItems []repository.JobProfileWithLastJob,
	now time.Time,
) []ApprovedJobProfileItem {
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
		tierA := jobProfileSortTier(items[i])
		tierB := jobProfileSortTier(items[j])

		if tierA != tierB {
			return tierA < tierB
		}

		if tierA == 0 {
			return *items[i].DaysSinceLastJob > *items[j].DaysSinceLastJob
		}

		return false
	})

	return items
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

	return PaginatedApprovedJobProfilesResponse{
		Items:      buildApprovedJobProfileItems(rawItems, time.Now()),
		TotalCount: totalCount,
		Limit:      limit,
		Offset:     offset,
	}, nil
}

func (s *jobProfileService) GetUnapprovedJobProfiles(ctx context.Context) ([]model.JobProfile, error) {
	return s.repo.GetUnapproved(ctx)
}

func (s *jobProfileService) SearchApprovedProfilesWithLatestJob(
	ctx context.Context,
	nameQuery string,
	profileType string,
	limit int,
	offset int,
) (PaginatedApprovedJobProfilesResponse, error) {
	trimmedName := strings.TrimSpace(nameQuery)
	if trimmedName == "" {
		return PaginatedApprovedJobProfilesResponse{}, errors.New("search query cannot be empty")
	}

	var isCommercial bool
	switch strings.ToLower(strings.TrimSpace(profileType)) {
	case "commercial":
		isCommercial = true
	case "residential", "":
		isCommercial = false
	default:
		return PaginatedApprovedJobProfilesResponse{}, errors.New("profile type must be 'residential' or 'commercial'")
	}

	rawItems, totalCount, err := s.repo.SearchApprovedByNameWithLatestJob(ctx, trimmedName, isCommercial, limit, offset)
	if err != nil {
		return PaginatedApprovedJobProfilesResponse{}, fmt.Errorf("failed to search approved job profiles: %w", err)
	}

	return PaginatedApprovedJobProfilesResponse{
		Items:      buildApprovedJobProfileItems(rawItems, time.Now()),
		TotalCount: totalCount,
		Limit:      limit,
		Offset:     offset,
	}, nil
}

func (s *jobProfileService) SearchApprovedJobProfilesByName(
	ctx context.Context,
	nameQuery string,
	limit int,
	offset int,
) (PaginatedJobProfilesResponse, error) {
	trimmedName := strings.TrimSpace(nameQuery)
	if trimmedName == "" {
		return PaginatedJobProfilesResponse{}, errors.New("search query cannot be empty")
	}

	profiles, totalCount, err := s.repo.SearchApprovedByName(ctx, trimmedName, limit, offset)
	if err != nil {
		return PaginatedJobProfilesResponse{}, fmt.Errorf("failed to search approved job profiles by name: %w", err)
	}

	if profiles == nil {
		profiles = make([]model.JobProfile, 0)
	}

	return PaginatedJobProfilesResponse{
		Items:      profiles,
		TotalCount: totalCount,
		Limit:      limit,
		Offset:     offset,
	}, nil
}

func (s *jobProfileService) DeleteJobProfile(ctx context.Context, id int64) error {
	if id == 0 {
		return errors.New("invalid job profile ID")
	}
	return s.repo.Delete(ctx, id)
}
