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

	teams := app.Group("/api/teams", middleware.AuthMiddleware())
	teams.Get("/", middleware.RequireRole("ADMIN", "TEAM LEAD", "EMPLOYEE"), teamHandler.GetAll)
	teams.Post("/", middleware.RequireRole("ADMIN"), teamHandler.Create)
	teams.Get("/:id", middleware.RequireRole("ADMIN"), teamHandler.GetByID)
	teams.Put("/:id", middleware.RequireRole("ADMIN"), teamHandler.Update)
	teams.Delete("/:id", middleware.RequireRole("ADMIN"), teamHandler.Delete)
}
