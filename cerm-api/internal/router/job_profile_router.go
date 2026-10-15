package router

import (
	"database/sql"

	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterJobProfileRoutes(app *fiber.App, db *sql.DB) {
	jobRepo := repository.NewJobProfileRepository(db)
	jobSvc := service.NewJobProfileService(jobRepo)
	jobHandler := handler.NewJobProfileHandler(jobSvc)

	jobProfiles := app.Group("/api/job-profiles")
	jobProfiles.Post("/", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), jobHandler.Create)
	jobProfiles.Put("/:id", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), jobHandler.Update)
	jobProfiles.Get("/approved", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), jobHandler.GetApproved)
	jobProfiles.Get("/unapproved", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), jobHandler.GetUnapproved)
	jobProfiles.Delete("/:id", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"), jobHandler.Delete)
}
