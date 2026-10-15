package router

import (
	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository/http"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterAmendApiRoutes(app *fiber.App) {
	amendApiRepo := http.NewAmendApiHttpRepository()
	amendApiService := service.NewAmendApiService(amendApiRepo)
	amendApiHandler := handler.NewAmendApiHandler(amendApiService)

	amendAPI := app.Group("/api/amend")
	amendAPI.Get("/services", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN", "LEAD", "EMPLOYEE"), amendApiHandler.GetAll)
}
