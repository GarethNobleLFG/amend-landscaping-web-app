package middleware

import (
	"log/slog"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func RequestLogger() fiber.Handler {
	return logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${method} ${path} (${latency}) ${error}\n",
		TimeFormat: "2006-01-02 15:04:05",
		Output:     os.Stdout,
	})
}

func PanicRecovery() fiber.Handler {
	return recover.New(recover.Config{
		EnableStackTrace: true,
	})
}

func JSONErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}

	slog.Error("request error",
		"method", c.Method(),
		"path", c.Path(),
		"status", code,
		"error", err.Error(),
	)

	return c.Status(code).JSON(fiber.Map{
		"error": err.Error(),
	})
}
