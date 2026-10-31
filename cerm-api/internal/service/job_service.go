package service

import (
	"context"
	"fmt"
	"time"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
)

type JobService interface {
	CreateJob(ctx context.Context, jobProfileID int64, teamID *int64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string) (int64, error)
	GetJobByID(ctx context.Context, id int64) (*repository.JobWithProfile, error)
	GetAllJobs(ctx context.Context) ([]repository.JobWithProfile, error)
	GetByMonthAndYear(ctx context.Context, month int, year int) ([]repository.JobWithProfile, error)
	GetByWeekAndTeam(ctx context.Context, teamID int64, startDate time.Time, endDate time.Time) ([]repository.JobWithProfile, error)
	UpdateJob(ctx context.Context, id int64, jobProfileID int64, teamID *int64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string) error
	DeleteJob(ctx context.Context, id int64) error
}

type jobService struct {
	jobRepo repository.JobRepository
}

func NewJobService(jobRepo repository.JobRepository) JobService {
	return &jobService{jobRepo: jobRepo}
}

// CreateJob validates and creates a new job record
func (s *jobService) CreateJob(ctx context.Context, jobProfileID int64, teamID *int64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string) (int64, error) {
	if jobProfileID <= 0 {
		return 0, fmt.Errorf("invalid job profile ID")
	}

	job := &model.Job{
		JobProfileID: jobProfileID,
		TeamID:       teamID,
		ScheduledDay: scheduledDay,
		StartTime:    startTime,
		EndTime:      endTime,
		Completed:    completed,
		Notes:        notes,
	}

	id, err := s.jobRepo.Create(ctx, job)
	if err != nil {
		return 0, fmt.Errorf("service failed to create job: %w", err)
	}

	return id, nil
}

// GetJobByID retrieves a single job by ID along with its profile
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

// GetAllJobs retrieves all scheduled jobs along with their profiles
func (s *jobService) GetAllJobs(ctx context.Context) ([]repository.JobWithProfile, error) {
	jobs, err := s.jobRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("service failed to get all jobs: %w", err)
	}

	return jobs, nil
}

// GetJobsByMonthAndYear retrieves all jobs for a given month and year with validation and profiles
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
func (s *jobService) UpdateJob(ctx context.Context, id int64, jobProfileID int64, teamID *int64, scheduledDay time.Time, startTime *time.Time, endTime *time.Time, completed bool, notes *string) error {
	if id <= 0 {
		return fmt.Errorf("invalid job ID")
	}
	if jobProfileID <= 0 {
		return fmt.Errorf("invalid job profile ID")
	}

	job := &model.Job{
		ID:           id,
		JobProfileID: jobProfileID,
		TeamID:       teamID,
		ScheduledDay: scheduledDay,
		StartTime:    startTime,
		EndTime:      endTime,
		Completed:    completed,
		Notes:        notes,
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
