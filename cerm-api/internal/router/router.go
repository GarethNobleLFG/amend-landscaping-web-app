package router

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB) {
	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "ok",
			"db":     "connected",
		})
	})

	// Register modular route groups
	RegisterAuthRoutes(app, db)
	RegisterAmendApiRoutes(app)
	RegisterCustomerRoutes(app, db)
}
