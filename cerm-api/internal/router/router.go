package router

import (
	"database/sql"

	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB) {
	// Customer Profile: Repo -> Service -> Handler
	customerRepo := repository.NewCustomerProfileRepository(db)
	customerSvc := service.NewCustomerProfileService(customerRepo)
	customerHandler := handler.NewCustomerProfileHandler(customerSvc)

	// Auth (User): Repo -> Service -> Handler
	userRepo := repository.NewUserRepository(db)
	userSvc := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userSvc)

	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "ok",
			"db":     "connected",
		})
	})

	// Auth Routes (Public)
	auth := app.Group("/api/auth")
	auth.Post("/signup", userHandler.SignUp)
	auth.Post("/signin", userHandler.SignIn)

	auth.Get("/me", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN", "LEAD", "EMPLOYEE"), userHandler.Me)

	adminCustomers := app.Group("/api/customer-profiles")
	adminCustomers.Post("/", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.Create)
	adminCustomers.Put("/:id", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.Update)
	adminCustomers.Get("/approved", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.GetApproved)
	adminCustomers.Get("/unapproved", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.GetUnapproved)
	adminCustomers.Delete("/:id", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.Delete)
}
