package handler

import (
	"strconv"
	"time"

	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type JobHandler struct {
	service service.JobService
}

func NewJobHandler(svc service.JobService) *JobHandler {
	return &JobHandler{service: svc}
}

type createJobRequest struct {
	JobProfileID int64   `json:"job_profile_id" form:"job_profile_id"`
	TeamID       *int64  `json:"team_id" form:"team_id"`
	ScheduledDay string  `json:"scheduled_day" form:"scheduled_day"` // Expected format: "YYYY-MM-DD"
	Notes        *string `json:"notes" form:"notes"`
}

type updateJobRequest struct {
	JobProfileID int64   `json:"job_profile_id" form:"job_profile_id"`
	TeamID       *int64  `json:"team_id" form:"team_id"`
	ScheduledDay string  `json:"scheduled_day" form:"scheduled_day"` // Expected format: "YYYY-MM-DD"
	Notes        *string `json:"notes" form:"notes"`
}

// POST /api/jobs
func (h *JobHandler) Create(c *fiber.Ctx) error {
	var req createJobRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.JobProfileID <= 0 || req.ScheduledDay == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Job profile ID and scheduled day are required"})
	}

	scheduledDay, err := time.Parse("2006-01-02", req.ScheduledDay)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date format. Use YYYY-MM-DD"})
	}

	id, err := h.service.CreateJob(c.UserContext(), req.JobProfileID, req.TeamID, scheduledDay, req.Notes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id, "success": true})
}

// GET /api/jobs/:id
func (h *JobHandler) GetByID(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil || id <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid job ID"})
	}

	job, err := h.service.GetJobByID(c.UserContext(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Job not found"})
	}

	return c.Status(fiber.StatusOK).JSON(job)
}

// GET /api/jobs
func (h *JobHandler) GetAll(c *fiber.Ctx) error {
	jobs, err := h.service.GetAllJobs(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(jobs)
}

// GET /api/jobs/month?month=X&year=YYYY
func (h *JobHandler) GetByMonthAndYear(c *fiber.Ctx) error {
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	if monthStr == "" || yearStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Month and year query parameters are required"})
	}

	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid month parameter"})
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil || year < 2000 || year > 2100 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid year parameter"})
	}

	jobs, err := h.service.GetByMonthAndYear(c.UserContext(), month, year)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(jobs)
}

// PUT /api/jobs/:id
func (h *JobHandler) Update(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil || id <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid job ID"})
	}

	var req updateJobRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.JobProfileID <= 0 || req.ScheduledDay == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Job profile ID and scheduled day are required"})
	}

	scheduledDay, err := time.Parse("2006-01-02", req.ScheduledDay)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date format. Use YYYY-MM-DD"})
	}

	err = h.service.UpdateJob(c.UserContext(), id, req.JobProfileID, req.TeamID, scheduledDay, req.Notes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

// DELETE /api/jobs/:id
func (h *JobHandler) Delete(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil || id <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid job ID"})
	}

	err = h.service.DeleteJob(c.UserContext(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}
