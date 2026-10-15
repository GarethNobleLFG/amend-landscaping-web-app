package service

import (
	"fmt"
	"net/smtp"
	"os"
)

type SendEmailService struct {
	SMTPHost string
	SMTPPort string
}

func NewSendEmailService() *SendEmailService {
	return &SendEmailService{
		SMTPHost: "smtp.gmail.com",
		SMTPPort: "587",
	}
}

func (s *SendEmailService) SendEmail(toEmail, subject, htmlBody string) error {
	fromEmail := os.Getenv("COMPANY_USER")
	appPassword := os.Getenv("COMPANY_PASS")

	if fromEmail == "" || appPassword == "" {
		return fmt.Errorf("COMPANY_USER and COMPANY_PASS environment variables must be set")
	}

	auth := smtp.PlainAuth("", fromEmail, appPassword, s.SMTPHost)

	// Construct headers and MIME type for HTML content
	headers := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";"
	msg := []byte(fmt.Sprintf("To: %s\r\nSubject: %s\r\n%s\r\n\r\n%s", toEmail, subject, headers, htmlBody))

	addr := fmt.Sprintf("%s:%s", s.SMTPHost, s.SMTPPort)

	err := smtp.SendMail(addr, auth, fromEmail, []string{toEmail}, msg)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
