package handler

import (
	"strconv"
	"time"

	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type JobHandler struct {
	jobService service.JobService
}

func NewJobHandler(jobService service.JobService) *JobHandler {
	return &JobHandler{jobService: jobService}
}

type CreateJobDTO struct {
	JobProfileID int64   `json:"job_profile_id"`
	TeamID       *int64  `json:"team_id"`
	ScheduledDay string  `json:"scheduled_day"` // Expected format: "YYYY-MM-DD"
	Notes        *string `json:"notes"`
}

type UpdateJobDTO struct {
	JobProfileID int64   `json:"job_profile_id"`
	TeamID       *int64  `json:"team_id"`
	ScheduledDay string  `json:"scheduled_day"` // Expected format: "YYYY-MM-DD"
	Notes        *string `json:"notes"`
}

// Create handles POST /jobs
func (h *JobHandler) Create(c *fiber.Ctx) error {
	var dto CreateJobDTO
	if err := c.BodyParser(&dto); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	scheduledDay, err := time.Parse("2006-01-02", dto.ScheduledDay)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid scheduled_day format. Use YYYY-MM-DD",
		})
	}

	id, err := h.jobService.CreateJob(c.Context(), dto.JobProfileID, dto.TeamID, scheduledDay, dto.Notes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"id":      id,
	})
}

// GetAll handles GET /jobs
func (h *JobHandler) GetAll(c *fiber.Ctx) error {
	jobs, err := h.jobService.GetAllJobs(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    jobs,
	})
}

// GetByMonthAndYear handles GET /jobs/month?month=X&year=YYYY
func (h *JobHandler) GetByMonthAndYear(c *fiber.Ctx) error {
	now := time.Now()

	// Parse or default month
	monthParam := c.Query("month")
	month := int(now.Month())
	if monthParam != "" {
		parsedMonth, err := strconv.Atoi(monthParam)
		if err != nil || parsedMonth < 1 || parsedMonth > 12 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid month query parameter. Must be 1-12",
			})
		}
		month = parsedMonth
	}

	// Parse or default year
	yearParam := c.Query("year")
	year := now.Year()
	if yearParam != "" {
		parsedYear, err := strconv.Atoi(yearParam)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid year query parameter",
			})
		}
		year = parsedYear
	}

	jobs, err := h.jobService.GetJobsByMonthAndYear(c.Context(), month, year)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    jobs,
	})
}

// GetByID handles GET /jobs/:id
func (h *JobHandler) GetByID(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid job ID",
		})
	}

	job, err := h.jobService.GetJobByID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Job not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    job,
	})
}

// Update handles PUT /jobs/:id
func (h *JobHandler) Update(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid job ID",
		})
	}

	var dto UpdateJobDTO
	if err := c.BodyParser(&dto); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	scheduledDay, err := time.Parse("2006-01-02", dto.ScheduledDay)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid scheduled_day format. Use YYYY-MM-DD",
		})
	}

	err = h.jobService.UpdateJob(c.Context(), id, dto.JobProfileID, dto.TeamID, scheduledDay, dto.Notes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// Delete handles DELETE /jobs/:id
func (h *JobHandler) Delete(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid job ID",
		})
	}

	err = h.jobService.DeleteJob(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}
