package router

import (
	"email-service-api/internal/handler"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "ok",
			"service": "email-service-api",
		})
	})

	// Email routes group
	emailGroup := app.Group("/api/emails")
	emailGroup.Post("/approve", handler.SendApprovalEmailHandler)
	emailGroup.Post("/confirm", handler.SendConfirmationEmailHandler)
	emailGroup.Post("/deny", handler.SendDenialEmailHandler)
	emailGroup.Post("/admin/notify", handler.SendAdminNotificationEmailHandler)
}
