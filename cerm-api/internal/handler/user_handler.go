package handler

import (
	"cerm-api/internal/service"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(svc service.UserService) *UserHandler {
	return &UserHandler{service: svc}
}

type signUpRequest struct {
    Name         string `json:"name" form:"name"`
    Email        string `json:"email" form:"email"`
    Password     string `json:"password" form:"password"`
    CreationCode string `json:"creation_code" form:"creation_code"` 
}

type signInRequest struct {
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
}

// POST /api/auth/signup
func (h *UserHandler) SignUp(c *fiber.Ctx) error {
	var req signUpRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" || req.Email == "" || req.Password == "" || req.CreationCode == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name, email, password, and creation code are required"})
	}

	res, err := h.service.SignUp(c.UserContext(), req.Name, req.Email, req.Password, req.CreationCode)
	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

// POST /api/auth/signin
func (h *UserHandler) SignIn(c *fiber.Ctx) error {
	var req signInRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and password are required"})
	}

	res, err := h.service.SignIn(c.UserContext(), req.Email, req.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(res)
}
