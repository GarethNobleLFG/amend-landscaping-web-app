package service

import (
	"fmt"

	"cerm-api/internal/model"
	"cerm-api/internal/repository/http"
	"cerm-api/pkg/utils"
)

type EmailService interface {
	SendApproval(profile model.JobProfile, customMessage string) error
	SendDenial(profile model.JobProfile, customMessage string) error
}

type emailService struct {
	emailRepo http.EmailRepository
}

func NewEmailService(emailRepo http.EmailRepository) EmailService {
	return &emailService{
		emailRepo: emailRepo,
	}
}

func (s *emailService) SendApproval(profile model.JobProfile, customMessage string) error {
	// 1. Map JobProfile to the microservice payload using your utility
	payload := utils.MapJobProfileToEmailPayload(profile)

	// 2. Call the repository to dispatch the HTTP request
	err := s.emailRepo.SendApprovalEmail(payload, customMessage)
	if err != nil {
		return fmt.Errorf("failed to send approval email for job %d: %w", profile.ID, err)
	}

	return nil
}

func (s *emailService) SendDenial(profile model.JobProfile, customMessage string) error {
	// 1. Map JobProfile to the microservice payload using your utility
	payload := utils.MapJobProfileToEmailPayload(profile)

	// 2. Call the repository to dispatch the HTTP request
	err := s.emailRepo.SendDenialEmail(payload, customMessage)
	if err != nil {
		return fmt.Errorf("failed to send denial email for job %d: %w", profile.ID, err)
	}

	return nil
}
