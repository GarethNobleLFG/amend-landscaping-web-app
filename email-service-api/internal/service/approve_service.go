package service

import (
	"encoding/json"
	"fmt"
	"strings"

	"email-service-api/internal/model"
	"email-service-api/pkg/utils"
)

type ApprovalEmailService struct{}

func NewApprovalEmailService() *ApprovalEmailService {
	return &ApprovalEmailService{}
}

func (s *ApprovalEmailService) SendApprovalEmail(appointment model.Appointment, customMessage string) error {
	// 1. Parse Services Requested
	servicesList := "None specified"
	if appointment.ServicesRequested != nil {
		var servicesMap map[string]bool

		switch v := appointment.ServicesRequested.(type) {
		case map[string]bool:
			servicesMap = v
		case string:
			_ = json.Unmarshal([]byte(v), &servicesMap)
		}

		if len(servicesMap) > 0 {
			var parsedServices []string
			for key, active := range servicesMap {
				if active {
					formattedName := strings.ReplaceAll(key, "_", " ")
					words := strings.Fields(formattedName)
					for i, w := range words {
						if len(w) > 0 {
							words[i] = strings.ToUpper(w[:1]) + w[1:]
						}
					}
					parsedServices = append(parsedServices, strings.Join(words, " "))
				}
			}
			if len(parsedServices) > 0 {
				servicesList = strings.Join(parsedServices, ", ")
			}
		}
	}

	// 2. Optional Custom Message HTML
	customMessageHtml := ""
	if strings.TrimSpace(customMessage) != "" {
		customMessageHtml = fmt.Sprintf(`
        <div style="background-color: #f8fafc; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">A message from our team:</p>
            <p style="color: #1e293b; font-size: 16px; margin: 0; line-height: 1.5; font-style: italic;">"%s"</p>
        </div>
        `, customMessage)
	}

	// 3. Commercial text variations
	commercialText := ""
	commercialPropertyText := "Residential Property"
	commercialTitle := ""
	if appointment.IsCommercial {
		commercialText = "commercial "
		commercialPropertyText = "Commercial Property"
		commercialTitle = "Commercial "
	}

	// 4. Construct HTML Body
	htmlBody := fmt.Sprintf(`
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            %s
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;">Dear %s,</p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for choosing Amend Landscaping! We are thrilled to inform you that your %sservice request has been reviewed and <strong>officially approved</strong> by our team.
                </p>
                
                %s
                
                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">%sAppointment Details</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Address:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Services Requested:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Property Type:</strong> %s</p>
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Our crew is ready to deliver top-quality service. If you need to make any changes, please contact us as soon as possible.
                </p>

                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We look forward to transforming your outdoor %sspace!
                </p>
                
                <p style="color: #334155; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                    Warm regards,<br>
                    The Amend Landscaping Team
                </p>
            </div>

            %s
        </div>
    `,
		utils.ApprovalHeader,
		appointment.Name,
		commercialText,
		customMessageHtml,
		commercialTitle,
		appointment.Address,
		servicesList,
		commercialPropertyText,
		commercialText,
		utils.StandardFooter(),
	)

	// 5. Determine Subject
	subject := "Thank You for Choosing Amend Landscaping!"

	// 6. Initialize the Email Service on its own and send
	emailService := NewSendEmailService()
	err := emailService.SendEmail(appointment.Email, subject, htmlBody)
	if err != nil {
		return fmt.Errorf("error sending approval email to %s: %w", appointment.Email, err)
	}

	return nil
}
