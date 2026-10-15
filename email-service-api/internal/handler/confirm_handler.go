package handler

import (
	"email-service-api/internal/model"
	"email-service-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type ConfirmationEmailRequest struct {
	Appointment model.Appointment `json:"appointment"`
}

func SendConfirmationEmailHandler(c *fiber.Ctx) error {
	var req ConfirmationEmailRequest

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

	confirmationService := service.NewConfirmationEmailService()

	err := confirmationService.SendConfirmationEmail(req.Appointment)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Confirmation email sent successfully!",
	})
}
