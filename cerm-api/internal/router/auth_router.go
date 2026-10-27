package router

import (
	"database/sql"

	"cerm-api/internal/handler"
	"cerm-api/internal/middleware"
	"cerm-api/internal/repository"
	"cerm-api/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(app *fiber.App, db *sql.DB) {
	userRepo := repository.NewUserRepository(db)
	userSvc := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userSvc)

	auth := app.Group("/api/auth")
	auth.Post("/signup", userHandler.SignUp)
	auth.Post("/signin", userHandler.SignIn)
	auth.Get("/me", middleware.AuthMiddleware(), middleware.RequireRole("ADMIN", "TEAM LEAD", "EMPLOYEE"), userHandler.Me)

	users := app.Group("/api/users", middleware.AuthMiddleware())
	users.Get("/", middleware.RequireRole("ADMIN"), userHandler.GetAll)
	users.Put("/:id", middleware.RequireRole("ADMIN", "TEAM LEAD", "EMPLOYEE"), userHandler.Update)
}
