package repository

import (
	"context"
	"database/sql"

	"cerm-api/internal/model"
)

type TeamRepository interface {
	Create(ctx context.Context, team *model.Team) error
	FindByID(ctx context.Context, id int) (*model.Team, error)
	FindAll(ctx context.Context) ([]*model.Team, error)
	Update(ctx context.Context, team *model.Team) error
	Delete(ctx context.Context, id int) error
}

type teamRepository struct {
	db *sql.DB
}

func NewTeamRepository(db *sql.DB) TeamRepository {
	return &teamRepository{db: db}
}

func (r *teamRepository) Create(ctx context.Context, team *model.Team) error {
	query := `
        INSERT INTO teams (name)
        VALUES ($1)
        RETURNING id, created_at, updated_at
    `
	return r.db.QueryRowContext(ctx, query, team.Name).Scan(
		&team.ID,
		&team.CreatedAt,
		&team.UpdatedAt,
	)
}

func (r *teamRepository) FindByID(ctx context.Context, id int) (*model.Team, error) {
	query := `SELECT id, name, created_at, updated_at FROM teams WHERE id = $1`
	team := &model.Team{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&team.ID,
		&team.Name,
		&team.CreatedAt,
		&team.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return team, nil
}

func (r *teamRepository) FindAll(ctx context.Context) ([]*model.Team, error) {
	query := `SELECT id, name, created_at, updated_at FROM teams`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []*model.Team
	for rows.Next() {
		team := &model.Team{}
		err := rows.Scan(
			&team.ID,
			&team.Name,
			&team.CreatedAt,
			&team.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return teams, nil
}

func (r *teamRepository) Update(ctx context.Context, team *model.Team) error {
	query := `
        UPDATE teams 
        SET name = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
        RETURNING updated_at
    `
	return r.db.QueryRowContext(ctx, query, team.Name, team.ID).Scan(&team.UpdatedAt)
}

func (r *teamRepository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM teams WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
