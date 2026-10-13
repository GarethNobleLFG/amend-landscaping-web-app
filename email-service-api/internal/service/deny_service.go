package service

import (
	"fmt"
	"strings"

	"email-service-api/internal/model"
	"email-service-api/pkg/utils"
)

type DenialEmailService struct{}

func NewDenialEmailService() *DenialEmailService {
	return &DenialEmailService{}
}

func (s *DenialEmailService) SendDenialEmail(appointment model.Appointment, customMessage string) error {
	// 1. Commercial text variation
	commercialText := ""
	if appointment.IsCommercial {
		commercialText = "commercial "
	}

	// 2. Optional Custom Message HTML
	customMessageHtml := ""
	if strings.TrimSpace(customMessage) != "" {
		customMessageHtml = fmt.Sprintf(`
        <div style="background-color: #f8fafc; border-left: 4px solid #dc2626; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">A message from our team:</p>
            <p style="color: #1e293b; font-size: 16px; margin: 0; line-height: 1.5; font-style: italic;">"%s"</p>
        </div>
        `, customMessage)
	}

	// 3. Construct HTML Body
	htmlBody := fmt.Sprintf(`
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            %s
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;">Dear %s,</p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for reaching out to Amend Landscaping. Unfortunately, we are <strong>unable to fulfill your %sservice request</strong> at this time. 
                    This can sometimes be due to our current scheduling capacity, service area constraints, or the specific nature of the request.
                </p>
                
                %s
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We sincerely appreciate your interest in our services and hope we might have the opportunity to serve you and your business in the future.
                </p>
                
                <p style="color: #334155; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                    Warm regards,<br>
                    The Amend Landscaping Team
                </p>
            </div>

            %s
        </div>
    `,
		utils.CancellationHeader,
		appointment.Name,
		commercialText,
		customMessageHtml,
		utils.StandardFooter(),
	)

	// 4. Determine Subject
	subject := "Update Regarding Your Amend Landscaping Request"
	if appointment.IsCommercial {
		subject = "Update Regarding Your Commercial Landscaping Request"
	}

	// 5. Initialize SendEmailService and send
	emailService := NewSendEmailService()
	err := emailService.SendEmail(appointment.Email, subject, htmlBody)
	if err != nil {
		return fmt.Errorf("error sending denial email to %s: %w", appointment.Email, err)
	}

	return nil
}
