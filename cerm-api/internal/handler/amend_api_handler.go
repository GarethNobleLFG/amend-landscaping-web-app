package handler

import (
	"github.com/gofiber/fiber/v2"

	"cerm-api/internal/service"
)

type AmendApiHandler struct {
	service service.AmendApiService
}

func NewAmendApiHandler(svc service.AmendApiService) *AmendApiHandler {
	return &AmendApiHandler{service: svc}
}

func (h *AmendApiHandler) GetAll(c *fiber.Ctx) error {
	services, err := h.service.GetAllServices(c.Context())
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(services)
}
