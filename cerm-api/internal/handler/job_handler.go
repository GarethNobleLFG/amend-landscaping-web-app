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
	StartTime    *string `json:"start_time" form:"start_time"`       // Expected format: RFC3339
	EndTime      *string `json:"end_time" form:"end_time"`           // Expected format: RFC3339
	Completed    bool    `json:"completed" form:"completed"`
	Notes        *string `json:"notes" form:"notes"`
}

type updateJobRequest struct {
	JobProfileID   int64   `json:"job_profile_id" form:"job_profile_id"`
	TeamID         *int64  `json:"team_id" form:"team_id"`
	ScheduledDay   string  `json:"scheduled_day" form:"scheduled_day"` // Expected format: "YYYY-MM-DD"
	StartTime      *string `json:"start_time" form:"start_time"`       // Expected format: RFC3339
	EndTime        *string `json:"end_time" form:"end_time"`           // Expected format: RFC3339
	Completed      bool    `json:"completed" form:"completed"`
	Notes          *string `json:"notes" form:"notes"`
	CompletedNotes *string `json:"completed_notes" form:"completed_notes"`
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

	var startTime *time.Time
	if req.StartTime != nil && *req.StartTime != "" {
		parsedStart, err := time.Parse(time.RFC3339, *req.StartTime)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start time format. Use RFC3339"})
		}
		startTime = &parsedStart
	}

	var endTime *time.Time
	if req.EndTime != nil && *req.EndTime != "" {
		parsedEnd, err := time.Parse(time.RFC3339, *req.EndTime)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end time format. Use RFC3339"})
		}
		endTime = &parsedEnd
	}

	id, err := h.service.CreateJob(c.UserContext(), req.JobProfileID, req.TeamID, scheduledDay, startTime, endTime, req.Completed, req.Notes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id":      id,
		"message": "Job successfully created",
	})
}

// GET /api/jobs
func (h *JobHandler) GetAll(c *fiber.Ctx) error {
	jobs, err := h.service.GetAllJobs(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(jobs)
}

// GET /api/jobs/month?month=X&year=Y
func (h *JobHandler) GetByMonthAndYear(c *fiber.Ctx) error {
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	if monthStr == "" || yearStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Query parameters 'month' and 'year' are required"})
	}

	month, err := strconv.Atoi(monthStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid month format"})
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid year format"})
	}

	jobs, err := h.service.GetByMonthAndYear(c.UserContext(), month, year)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(jobs)
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
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(job)
}

// GET /api/jobs/team/week?start=YYYY-MM-DD&end=YYYY-MM-DD
func (h *JobHandler) GetByWeekAndTeam(c *fiber.Ctx) error {
	startStr := c.Query("start")
	endStr := c.Query("end")

	if startStr == "" || endStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Query parameters 'start' and 'end' are required"})
	}

	startDate, err := time.Parse("2006-01-02", startStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start date format. Use YYYY-MM-DD"})
	}

	endDate, err := time.Parse("2006-01-02", endStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end date format. Use YYYY-MM-DD"})
	}

	userTeamID, ok := c.Locals("teamID").(*int64)
	if !ok || userTeamID == nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Team ID is missing from user session"})
	}

	jobs, err := h.service.GetByWeekAndTeam(c.UserContext(), *userTeamID, startDate, endDate)
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

	var startTime *time.Time
	if req.StartTime != nil && *req.StartTime != "" {
		parsedStart, err := time.Parse(time.RFC3339, *req.StartTime)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start time format. Use RFC3339"})
		}
		startTime = &parsedStart
	}

	var endTime *time.Time
	if req.EndTime != nil && *req.EndTime != "" {
		parsedEnd, err := time.Parse(time.RFC3339, *req.EndTime)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end time format. Use RFC3339"})
		}
		endTime = &parsedEnd
	}

	err = h.service.UpdateJob(
		c.UserContext(),
		id,
		req.JobProfileID,
		req.TeamID,
		scheduledDay,
		startTime,
		endTime,
		req.Completed,
		req.Notes,
		req.CompletedNotes,
	)
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
