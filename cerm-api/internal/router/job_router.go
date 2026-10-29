package router

import (
	"database/sql"

	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterJobRoutes(app *fiber.App, db *sql.DB) {
	jobRepo := repository.NewJobRepository(db)
	jobSvc := service.NewJobService(jobRepo)
	jobHandler := handler.NewJobHandler(jobSvc)

	jobs := app.Group("/api/jobs", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"))
	jobs.Post("/", jobHandler.Create)
	jobs.Get("/", jobHandler.GetAll)
	jobs.Get("/month", jobHandler.GetByMonthAndYear)
	jobs.Get("/:id", jobHandler.GetByID)
	jobs.Put("/:id", jobHandler.Update)
	jobs.Delete("/:id", jobHandler.Delete)
}
