package handler

import (
	"database/sql"
	"errors"
	
	"cerm-api/internal/model"
	"cerm-api/internal/service"
	"github.com/gofiber/fiber/v2"
)

type CustomerProfileHandler struct {
	service service.CustomerProfileService
}

func NewCustomerProfileHandler(svc service.CustomerProfileService) *CustomerProfileHandler {
	return &CustomerProfileHandler{service: svc}
}

// POST /api/customer-profiles
func (h *CustomerProfileHandler) Create(c *fiber.Ctx) error {
	var profile model.CustomerProfile
	if err := c.BodyParser(&profile); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.service.CreateCustomerProfile(c.UserContext(), &profile); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(profile)
}

// PUT /api/customer-profiles/:id
func (h *CustomerProfileHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	var profile model.CustomerProfile
	if err := c.BodyParser(&profile); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.service.UpdateCustomerProfile(c.UserContext(), id, &profile); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer profile not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	profile.ID = id
	return c.Status(fiber.StatusOK).JSON(profile)
}

// GET /api/customer-profiles/approved
func (h *CustomerProfileHandler) GetApproved(c *fiber.Ctx) error {
	profiles, err := h.service.GetApprovedProfiles(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(profiles)
}

// GET /api/customer-profiles/unapproved
func (h *CustomerProfileHandler) GetUnapproved(c *fiber.Ctx) error {
	profiles, err := h.service.GetUnapprovedProfiles(c.UserContext())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(profiles)
}

// DELETE /api/customer-profiles/:id
func (h *CustomerProfileHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.service.DeleteCustomerProfile(c.UserContext(), id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer profile not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Customer profile deleted successfully"})
}
