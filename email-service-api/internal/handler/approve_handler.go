package handler

import (
	"email-service-api/internal/model"
	services "email-service-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

type ApprovalEmailRequest struct {
	Appointment   model.Appointment `json:"appointment"`
	CustomMessage string            `json:"custom_message"`
}

func SendApprovalEmailHandler(c *fiber.Ctx) error {
	var req ApprovalEmailRequest

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

	approvalService := services.NewApprovalEmailService()

	err := approvalService.SendApprovalEmail(req.Appointment, req.CustomMessage)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Approval email sent successfully!",
	})
}
