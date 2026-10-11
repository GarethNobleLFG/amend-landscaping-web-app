package router

import (
	"database/sql"

	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterCustomerRoutes(app *fiber.App, db *sql.DB) {
	customerRepo := repository.NewCustomerProfileRepository(db)
	customerSvc := service.NewCustomerProfileService(customerRepo)
	customerHandler := handler.NewCustomerProfileHandler(customerSvc)

	adminCustomers := app.Group("/api/customer-profiles")
	adminCustomers.Post("/", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.Create)
	adminCustomers.Put("/:id", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.Update)
	adminCustomers.Get("/approved", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.GetApproved)
	adminCustomers.Get("/unapproved", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.GetUnapproved)
	adminCustomers.Delete("/:id", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), customerHandler.Delete)
}
