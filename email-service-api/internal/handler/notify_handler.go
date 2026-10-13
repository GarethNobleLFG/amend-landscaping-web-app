package handler

import (
	"os"
	"strings"

	"email-service-api/internal/model"
	"email-service-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type AdminNotificationRequest struct {
	Appointment model.Appointment `json:"appointment"`
	AdminEmail  string            `json:"admin_email,omitempty"` // Optional override
}

func SendAdminNotificationEmailHandler(c *fiber.Ctx) error {
	var req AdminNotificationRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON request body",
		})
	}

	// Basic validation
	if req.Appointment.Email == "" || req.Appointment.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required appointment fields (name and email are required)",
		})
	}

	// Determine admin email destination
	adminEmail := req.AdminEmail
	if strings.TrimSpace(adminEmail) == "" {
		adminEmail = os.Getenv("ADMIN_EMAIL")
	}
	if strings.TrimSpace(adminEmail) == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Admin email not configured (ADMIN_EMAIL environment variable is missing)",
		})
	}

	adminService := service.NewAdminNotificationEmailService()

	err := adminService.SendAdminNotificationEmail(req.Appointment, adminEmail)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Admin notification email sent successfully!",
	})
}
