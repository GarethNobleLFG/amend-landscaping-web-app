package main

import (
	"email-service-api/internal/config"
	"email-service-api/internal/middleware"
	"email-service-api/internal/router"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.LoadConfig()

	app := fiber.New(fiber.Config{
		AppName: "email-service-api",
	})

	// Register Middlewares
	middleware.SetupMiddlewares(app)

	// Register Routes
	router.SetupRoutes(app)

	// Start Server
	log.Printf("Starting server on port %s...", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Server shutdown: %v", err)
	}
}
