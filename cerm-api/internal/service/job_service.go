package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
	"cerm-api/pkg/utils"
)

type JobService interface {
	CreateJob(ctx context.Context, jobProfileID int64, teamID *int64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string, servicesRequested json.RawMessage) (int64, error)
	GetJobByID(ctx context.Context, id int64) (*repository.JobWithProfile, error)
	GetAllJobs(ctx context.Context) ([]repository.JobWithProfile, error)
	GetByMonthAndYear(ctx context.Context, month int, year int) ([]repository.JobWithProfile, error)
	GetByWeekAndTeam(ctx context.Context, teamID int64, startDate time.Time, endDate time.Time) ([]repository.JobWithProfile, error)
	UpdateJob(ctx context.Context, id int64, teamID *int64, name *string, email *string, phoneNumber *string, address *string, jobPayout *float64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string, completedNotes *string, servicesRequested json.RawMessage) error
	DeleteJob(ctx context.Context, id int64) error
}

type jobService struct {
	jobRepo        repository.JobRepository
	jobProfileRepo JobProfileService
}

func NewJobService(jobRepo repository.JobRepository, jobProfileRepo JobProfileService) JobService {
	return &jobService{
		jobRepo:        jobRepo,
		jobProfileRepo: jobProfileRepo,
	}
}

// CreateJob looks up the JobProfile by jobProfileID and populates the snapshot fields on the Job
func (s *jobService) CreateJob(
	ctx context.Context,
	jobProfileID int64,
	teamID *int64,
	scheduledDay time.Time,
	startTime *time.Time,
	endTime *time.Time,
	completed bool,
	notes *string,
	servicesRequested json.RawMessage,
) (int64, error) {
	if jobProfileID <= 0 {
		return 0, fmt.Errorf("invalid job profile ID")
	}

	profile, err := s.jobProfileRepo.GetJobProfileByID(ctx, jobProfileID)
	if err != nil {
		return 0, fmt.Errorf("service failed to fetch job profile: %w", err)
	}
	if profile == nil {
		return 0, fmt.Errorf("job profile not found")
	}

	name := profile.Name
	email := profile.Email
	phoneNumber := profile.PhoneNumber
	address := utils.FormatProfileAddress(profile.Address, profile.City, profile.State, profile.Zip)

	var jobPayout *float64
	if profile.JobPayout != nil {
		if *profile.JobPayout < 0 {
			return 0, fmt.Errorf("invalid job payout on profile: cannot be negative")
		}
		payoutCopy := *profile.JobPayout
		jobPayout = &payoutCopy
	}

	// If no per-job services were explicitly passed, default to the profile's requested services
	resolvedServices := servicesRequested
	if len(resolvedServices) == 0 && len(profile.ServicesRequested) > 0 {
		resolvedServices = append(json.RawMessage(nil), profile.ServicesRequested...)
	}

	job := &model.Job{
		TeamID:            teamID,
		Name:              &name,
		Email:             &email,
		PhoneNumber:       &phoneNumber,
		Address:           &address,
		JobPayout:         jobPayout,
		ScheduledDay:      scheduledDay,
		StartTime:         startTime,
		EndTime:           endTime,
		Completed:         completed,
		Notes:             notes,
		ServicesRequested: resolvedServices,
	}

	id, err := s.jobRepo.Create(ctx, job)
	if err != nil {
		return 0, fmt.Errorf("service failed to create job: %w", err)
	}

	return id, nil
}

// GetJobByID retrieves a single job by ID
func (s *jobService) GetJobByID(ctx context.Context, id int64) (*repository.JobWithProfile, error) {
	if id <= 0 {
		return nil, fmt.Errorf("invalid job ID")
	}

	job, err := s.jobRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("service failed to get job by id: %w", err)
	}

	return job, nil
}

// GetAllJobs retrieves all scheduled jobs
func (s *jobService) GetAllJobs(ctx context.Context) ([]repository.JobWithProfile, error) {
	jobs, err := s.jobRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("service failed to get all jobs: %w", err)
	}

	return jobs, nil
}

// GetByMonthAndYear retrieves all jobs for a given month and year with validation
func (s *jobService) GetByMonthAndYear(ctx context.Context, month int, year int) ([]repository.JobWithProfile, error) {
	if month < 1 || month > 12 {
		return nil, fmt.Errorf("invalid month: must be between 1 and 12")
	}
	if year < 2000 || year > 2100 {
		return nil, fmt.Errorf("invalid year")
	}

	jobs, err := s.jobRepo.GetByMonthAndYear(ctx, month, year)
	if err != nil {
		return nil, fmt.Errorf("service failed to get jobs by month and year: %w", err)
	}

	return jobs, nil
}

// GetByWeekAndTeam retrieves jobs for a specific team within the given week date range
func (s *jobService) GetByWeekAndTeam(ctx context.Context, teamID int64, startDate time.Time, endDate time.Time) ([]repository.JobWithProfile, error) {
	normalizedStart := time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, startDate.Location())
	normalizedEnd := time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 23, 59, 59, 999999999, endDate.Location())

	jobs, err := s.jobRepo.GetByWeekAndTeam(ctx, teamID, normalizedStart, normalizedEnd)
	if err != nil {
		return nil, fmt.Errorf("service failed to get jobs by week and team: %w", err)
	}

	return jobs, nil
}

// UpdateJob updates an existing job record
func (s *jobService) UpdateJob(ctx context.Context, id int64, teamID *int64, name *string, email *string, phoneNumber *string, address *string, jobPayout *float64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string, completedNotes *string, servicesRequested json.RawMessage) error {
	if id <= 0 {
		return fmt.Errorf("invalid job ID")
	}
	if jobPayout != nil && *jobPayout < 0 {
		return fmt.Errorf("invalid job payout: cannot be negative")
	}

	job := &model.Job{
		ID:                id,
		TeamID:            teamID,
		Name:              name,
		Email:             email,
		PhoneNumber:       phoneNumber,
		Address:           address,
		JobPayout:         jobPayout,
		ScheduledDay:      scheduledDay,
		StartTime:         startTime,
		EndTime:           endTime,
		Completed:         completed,
		Notes:             notes,
		CompletedNotes:    completedNotes,
		ServicesRequested: servicesRequested,
	}

	err := s.jobRepo.Update(ctx, job)
	if err != nil {
		return fmt.Errorf("service failed to update job: %w", err)
	}

	return nil
}

// DeleteJob removes a job record by ID
func (s *jobService) DeleteJob(ctx context.Context, id int64) error {
	if id <= 0 {
		return fmt.Errorf("invalid job ID")
	}

	err := s.jobRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("service failed to delete job: %w", err)
	}

	return nil
}
