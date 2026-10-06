package main

import (
	"log"

	"cerm-api/internal/database"
	"cerm-api/internal/router"
	"github.com/gofiber/fiber/v2"
)

func main() {
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer db.Close()

	app := fiber.New()

	router.SetupRoutes(app, db)

	log.Fatal(app.Listen(":8080"))
}
