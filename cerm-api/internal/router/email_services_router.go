package router

import (
	"cerm-api/internal/handler"
	"cerm-api/internal/repository/http"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterEmailRoutes(app *fiber.App) {
	// Initialize dependencies (repository pulls EMAIL_SERVICE_URL from env internally)
	emailRepo := http.NewHTTPEmailRepository()
	emailSvc := service.NewEmailService(emailRepo)
	emailHandler := handler.NewEmailHandler(emailSvc)

	// Register job approval and denial email endpoints
	api := app.Group("/api")
	api.Post("/jobs/approve", emailHandler.SendApprovalHandler)
	api.Post("/jobs/deny", emailHandler.SendDenialHandler)
}
