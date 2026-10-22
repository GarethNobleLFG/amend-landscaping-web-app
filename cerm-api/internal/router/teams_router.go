package router

import (
	"database/sql"

	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterTeamRoutes(app *fiber.App, db *sql.DB) {
	teamRepo := repository.NewTeamRepository(db)
	teamSvc := service.NewTeamService(teamRepo)
	teamHandler := handler.NewTeamHandler(teamSvc)

	teams := app.Group("/api/teams", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN"))

	teams.Get("/", teamHandler.GetAll)
	teams.Post("/", teamHandler.Create)
	teams.Get("/:id", teamHandler.GetByID)
	teams.Put("/:id", teamHandler.Update)
	teams.Delete("/:id", teamHandler.Delete)
}
