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

	jobProfiles := app.Group("/api/job-profiles", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"))
	jobProfiles.Post("/", jobHandler.Create)
	jobProfiles.Put("/:id", jobHandler.Update)
	jobProfiles.Get("/approved", jobHandler.GetApproved)
	jobProfiles.Get("/unapproved", jobHandler.GetUnapproved)
	jobProfiles.Delete("/:id", jobHandler.Delete)
}
