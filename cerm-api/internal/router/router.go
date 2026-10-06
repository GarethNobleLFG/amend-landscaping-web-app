package router

import (
	"database/sql"

	"cerm-api/internal/repository"
	"cerm-api/internal/service"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB) {
	// Initialize Repository -> Service -> Handler
	customerRepo := repository.NewCustomerProfileRepository(db)
	customerSvc := service.NewCustomerProfileService(customerRepo)
	customerHandler := NewCustomerProfileHandler(customerSvc)

	// Health Check Route
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "ok",
			"db":     "connected",
		})
	})

	// Customer Profiles API Routes
	api := app.Group("/api/customer-profiles")
	api.Post("/", customerHandler.Create)
	api.Put("/:id", customerHandler.Update)
	api.Get("/approved", customerHandler.GetApproved)
	api.Get("/unapproved", customerHandler.GetUnapproved)
	api.Delete("/:id", customerHandler.Delete)
}
