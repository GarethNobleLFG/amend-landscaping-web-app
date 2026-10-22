package repository

import (
	"context"
	"database/sql"

	"cerm-api/internal/model"
)

type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	Update(ctx context.Context, user *model.User) error
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id string) (*model.User, error)
	FindAll(ctx context.Context) ([]*model.User, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *model.User) error {
	query := `
        INSERT INTO users (name, email, password, role, team_id)
        VALUES ($1, $2, $3, $4, NULL)
        RETURNING id, created_at, updated_at
    `
	user.TeamID = nil

	return r.db.QueryRowContext(ctx, query,
		user.Name,
		user.Email,
		user.Password,
		user.Role,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *userRepository) Update(ctx context.Context, user *model.User) error {
	query := `
        UPDATE users
        SET name = $1, email = $2, role = $3, team_id = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING updated_at
    `
	var teamID interface{}
	if user.TeamID != nil {
		teamID = *user.TeamID
	}

	return r.db.QueryRowContext(ctx, query,
		user.Name,
		user.Email,
		user.Role,
		teamID,
		user.ID,
	).Scan(&user.UpdatedAt)
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	query := `SELECT id, name, email, password, role, team_id, created_at, updated_at FROM users WHERE email = $1`
	user := &model.User{}
	var teamID sql.NullInt64

	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Role,
		&teamID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if teamID.Valid {
		id := int(teamID.Int64)
		user.TeamID = &id
	}

	return user, nil
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*model.User, error) {
	query := `SELECT id, name, email, password, role, team_id, created_at, updated_at FROM users WHERE id = $1`
	user := &model.User{}
	var teamID sql.NullInt64

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Role,
		&teamID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if teamID.Valid {
		tID := int(teamID.Int64)
		user.TeamID = &tID
	}

	return user, nil
}

func (r *userRepository) FindAll(ctx context.Context) ([]*model.User, error) {
	query := `SELECT id, name, email, password, role, team_id, created_at, updated_at FROM users`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*model.User
	for rows.Next() {
		user := &model.User{}
		var teamID sql.NullInt64

		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.Password,
			&user.Role,
			&teamID,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if teamID.Valid {
			tID := int(teamID.Int64)
			user.TeamID = &tID
		}

		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
