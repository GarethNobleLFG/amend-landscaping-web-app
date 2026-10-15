package handler

import (
	"cerm-api/internal/model"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type EmailActionRequest struct {
	JobProfile    model.JobProfile `json:"job_profile"`
	CustomMessage string           `json:"custom_message"`
}

type EmailHandler struct {
	emailService service.EmailService
}

func NewEmailHandler(emailService service.EmailService) *EmailHandler {
	return &EmailHandler{
		emailService: emailService,
	}
}

// SendApprovalHandler handles POST requests to trigger an approval email via the microservice
func (h *EmailHandler) SendApprovalHandler(c *fiber.Ctx) error {
	var req EmailActionRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON request body",
		})
	}

	// Basic validation
	if req.JobProfile.Email == "" || req.JobProfile.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required job profile fields (name and email are required)",
		})
	}

	err := h.emailService.SendApproval(req.JobProfile, req.CustomMessage)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Approval email sent successfully!",
	})
}

// SendDenialHandler handles POST requests to trigger a denial email via the microservice
func (h *EmailHandler) SendDenialHandler(c *fiber.Ctx) error {
	var req EmailActionRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON request body",
		})
	}

	// Basic validation
	if req.JobProfile.Email == "" || req.JobProfile.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required job profile fields (name and email are required)",
		})
	}

	err := h.emailService.SendDenial(req.JobProfile, req.CustomMessage)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Denial email sent successfully!",
	})
}
