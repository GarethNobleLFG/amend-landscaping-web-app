package handler

import (
	"database/sql"
	"errors"
	"strconv"
	"strings"

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
	limit, err := strconv.Atoi(c.Query("limit", "20"))
	if err != nil || limit < 1 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid limit query parameter",
		})
	}

	offset, err := strconv.Atoi(c.Query("offset", "0"))
	if err != nil || offset < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid offset query parameter",
		})
	}

	result, err := h.service.GetAllApprovedProfilesWithLatestJob(c.UserContext(), limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

// GET /api/job-profiles/unapproved
func (h *JobProfileHandler) GetUnapproved(c *fiber.Ctx) error {
	profiles, err := h.service.GetUnapprovedJobProfiles(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(profiles)
}

func (h *JobProfileHandler) SearchApprovedProfilesWithLatestJob(c *fiber.Ctx) error {
	nameQuery := strings.TrimSpace(c.Query("q", ""))
	if nameQuery == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "q query parameter is required",
		})
	}

	profileType := strings.ToLower(strings.TrimSpace(c.Query("type", "residential")))
	if profileType != "residential" && profileType != "commercial" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "type must be 'residential' or 'commercial'",
		})
	}

	limit, err := strconv.Atoi(c.Query("limit", "20"))
	if err != nil || limit < 1 || limit > 100 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid limit query parameter",
		})
	}

	offset, err := strconv.Atoi(c.Query("offset", "0"))
	if err != nil || offset < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid offset query parameter",
		})
	}

	result, err := h.service.SearchApprovedProfilesWithLatestJob(c.UserContext(), nameQuery, profileType, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

// GET /api/job-profiles/search
func (h *JobProfileHandler) SearchApprovedByName(c *fiber.Ctx) error {
	nameQuery := strings.TrimSpace(c.Query("q", ""))
	if nameQuery == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "q query parameter is required",
		})
	}

	limit, err := strconv.Atoi(c.Query("limit", "20"))
	if err != nil || limit < 1 || limit > 100 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid limit query parameter",
		})
	}

	offset, err := strconv.Atoi(c.Query("offset", "0"))
	if err != nil || offset < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid offset query parameter",
		})
	}

	result, err := h.service.SearchApprovedJobProfilesByName(c.UserContext(), nameQuery, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(result)
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
