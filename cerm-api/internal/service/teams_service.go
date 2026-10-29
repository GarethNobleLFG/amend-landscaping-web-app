package service

import (
	"context"
	"errors"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"
)

type TeamService interface {
	Create(ctx context.Context, name string, teamColor *string) (*model.Team, error)
	GetByID(ctx context.Context, id int) (*model.Team, error)
	GetAll(ctx context.Context) ([]*model.Team, error)
	Update(ctx context.Context, id int, name string, teamColor *string) (*model.Team, error)
	Delete(ctx context.Context, id int) error
}

type teamService struct {
	repo repository.TeamRepository
}

func NewTeamService(repo repository.TeamRepository) TeamService {
	return &teamService{repo: repo}
}

func (s *teamService) Create(ctx context.Context, name string, teamColor *string) (*model.Team, error) {
	if name == "" {
		return nil, errors.New("team name is required")
	}

	team := &model.Team{
		Name:      name,
		TeamColor: teamColor,
	}

	if err := s.repo.Create(ctx, team); err != nil {
		return nil, err
	}

	return team, nil
}

func (s *teamService) GetByID(ctx context.Context, id int) (*model.Team, error) {
	team, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, errors.New("team not found")
	}
	return team, nil
}

func (s *teamService) GetAll(ctx context.Context) ([]*model.Team, error) {
	return s.repo.FindAll(ctx)
}

func (s *teamService) Update(ctx context.Context, id int, name string, teamColor *string) (*model.Team, error) {
	if name == "" {
		return nil, errors.New("team name is required")
	}

	team, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, errors.New("team not found")
	}

	team.Name = name
	team.TeamColor = teamColor

	if err := s.repo.Update(ctx, team); err != nil {
		return nil, err
	}

	return team, nil
}

func (s *teamService) Delete(ctx context.Context, id int) error {
	if _, err := s.repo.FindByID(ctx, id); err != nil {
		return errors.New("team not found")
	}
	return s.repo.Delete(ctx, id)
}
