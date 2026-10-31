package handler

import (
	"strconv"

	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type TeamHandler struct {
	service service.TeamService
}

func NewTeamHandler(svc service.TeamService) *TeamHandler {
	return &TeamHandler{service: svc}
}

type createTeamRequest struct {
	Name      string  `json:"name" form:"name"`
	TeamColor *string `json:"team_color" form:"team_color"`
}

type updateTeamRequest struct {
	Name      string  `json:"name" form:"name"`
	TeamColor *string `json:"team_color" form:"team_color"`
}

// POST /api/teams
func (h *TeamHandler) Create(c *fiber.Ctx) error {
	var req createTeamRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Team name is required"})
	}

	team, err := h.service.Create(c.UserContext(), req.Name, req.TeamColor)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(team)
}

// GET /api/teams
func (h *TeamHandler) GetAll(c *fiber.Ctx) error {
	teams, err := h.service.GetAll(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(teams)
}

// GET /api/teams/my-team (or your team endpoint)
func (h *TeamHandler) GetMyTeam(c *fiber.Ctx) error {
	userTeamID, ok := c.Locals("teamID").(*int64)
	if !ok || *userTeamID <= 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized context"})
	}

	team, err := h.service.GetByID(c.UserContext(), int(*userTeamID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Team not found"})
	}

	return c.Status(fiber.StatusOK).JSON(team)
}

// PUT /api/teams/:id
func (h *TeamHandler) Update(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid team ID"})
	}

	var req updateTeamRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Team name is required"})
	}

	team, err := h.service.Update(c.UserContext(), id, req.Name, req.TeamColor)
	if err != nil {
		if err.Error() == "team not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(team)
}

// DELETE /api/teams/:id
func (h *TeamHandler) Delete(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid team ID"})
	}

	if err := h.service.Delete(c.UserContext(), id); err != nil {
		if err.Error() == "team not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Team deleted successfully"})
}
