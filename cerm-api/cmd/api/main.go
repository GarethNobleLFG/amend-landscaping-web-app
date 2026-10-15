package main

import (
	"log"

	"cerm-api/internal/database"
	"cerm-api/internal/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer db.Close()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173, http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
		Next: func(c *fiber.Ctx) bool {
			origin := c.Get("Origin")
			return origin == ""
		},
	}))

	router.SetupRoutes(app, db)

	log.Fatal(app.Listen(":8080"))
}
