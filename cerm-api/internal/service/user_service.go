package service

import (
	"context"
	"errors"
	"os"
	"time"

	"cerm-api/internal/model"
	"cerm-api/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthResponse struct {
	Token string     `json:"token"`
	User  model.User `json:"user"`
}

type UserService interface {
	SignUp(ctx context.Context, name, email, password, creationCode string) (*AuthResponse, error)
	SignIn(ctx context.Context, email, password string) (*AuthResponse, error)
	GetByID(ctx context.Context, userID string) (*model.User, error) // <-- Added to interface
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) SignUp(ctx context.Context, name, email, password, creationCode string) (*AuthResponse, error) {
	expectedCode := os.Getenv("USER_CREATION_CODE")
	if expectedCode == "" || creationCode != expectedCode {
		return nil, errors.New("invalid creation code")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Name:     name,
		Email:    email,
		Password: string(hashed),
		Role:     "EMPLOYEE",
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	token, err := generateJWT(user)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{Token: token, User: *user}, nil
}

func (s *userService) SignIn(ctx context.Context, email, password string) (*AuthResponse, error) {
	user, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	token, err := generateJWT(user)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{Token: token, User: *user}, nil
}

func (s *userService) GetByID(ctx context.Context, userID string) (*model.User, error) {
	user, err := s.repo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	return user, nil
}

func generateJWT(user *model.User) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "changeme_supersecret"
	}

	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
