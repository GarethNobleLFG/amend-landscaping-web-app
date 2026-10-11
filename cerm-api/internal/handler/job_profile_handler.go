package handler

import (
	"database/sql"
	"errors"
	"strconv"

	"cerm-api/internal/model"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type JobProfileHandler struct {
	service service.JobProfileService
}

func NewJobProfileHandler(svc service.JobProfileService) *JobProfileHandler {
	return &JobProfileHandler{service: svc}
}

// POST /api/job-profiles
func (h *JobProfileHandler) Create(c *fiber.Ctx) error {
	var profile model.JobProfile
	if err := c.BodyParser(&profile); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.service.CreateJobProfile(c.UserContext(), &profile); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(profile)
}

// PUT /api/job-profiles/:id
func (h *JobProfileHandler) Update(c *fiber.Ctx) error {
	idStr := c.Params("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid job profile ID format"})
	}

	var profile model.JobProfile
	if err := c.BodyParser(&profile); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.service.UpdateJobProfile(c.UserContext(), id, &profile); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Job profile not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	profile.ID = id
	return c.Status(fiber.StatusOK).JSON(profile)
}

// GET /api/job-profiles/approved
func (h *JobProfileHandler) GetApproved(c *fiber.Ctx) error {
	profiles, err := h.service.GetApprovedJobProfiles(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(profiles)
}

// GET /api/job-profiles/unapproved
func (h *JobProfileHandler) GetUnapproved(c *fiber.Ctx) error {
	profiles, err := h.service.GetUnapprovedJobProfiles(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(profiles)
}

// DELETE /api/job-profiles/:id
func (h *JobProfileHandler) Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")

	// Parse string parameter to int64
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid job profile ID format"})
	}

	// Pass the parsed int64 `id` to the service
	if err := h.service.DeleteJobProfile(c.UserContext(), id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Job profile not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Job profile deleted successfully"})
}
