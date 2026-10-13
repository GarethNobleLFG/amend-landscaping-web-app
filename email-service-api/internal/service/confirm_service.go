package service

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"email-service-api/internal/model"
	"email-service-api/pkg/utils"
)

type ConfirmationEmailService struct{}

func NewConfirmationEmailService() *ConfirmationEmailService {
	return &ConfirmationEmailService{}
}

func (s *ConfirmationEmailService) SendConfirmationEmail(appointment model.Appointment) error {
	// 1. Format Date
	var dateToUse string
	if appointment.ScheduledDate != nil && *appointment.ScheduledDate != "" {
		dateToUse = *appointment.ScheduledDate
	} else {
		dateToUse = appointment.CreatedAt
	}

	appointmentDate := "TBD"
	if parsedTime, err := time.Parse(time.RFC3339, dateToUse); err == nil {
		appointmentDate = parsedTime.Format("Monday, January 2, 2006")
	} else if dateToUse != "" {
		appointmentDate = dateToUse
	}

	// 2. Parse Services Requested
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

	// 3. Commercial text variations
	commercialText := ""
	commercialPropertyText := "Residential Property"
	if appointment.IsCommercial {
		commercialText = "commercial "
		commercialPropertyText = "Commercial Property"
	}

	// 4. Construct HTML Body
	htmlBody := fmt.Sprintf(`
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            %s
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;">Dear %s,</p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for reaching out to Amend Landscaping! We have successfully received your %sservice request. 
                </p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    <strong>What happens next?</strong><br>
                    A member of our team is reviewing your request and will be reaching out to you shortly to finalize details and officially approve your %srequest.
                </p>
                
                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Your Request Summary</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Requested Date:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Address:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Services Requested:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Property Type:</strong> %s</p>
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    If you need to make any changes to this request in the meantime, please feel free to reply directly to this email.
                </p>
                
                <p style="color: #334155; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                    Warm regards,<br>
                    The Amend Landscaping Team
                </p>
            </div>

            %s
        </div>
    `,
		utils.BookingHeader,
		appointment.Name,
		commercialText,
		commercialText,
		appointmentDate,
		appointment.Address,
		servicesList,
		commercialPropertyText,
		utils.StandardFooter(),
	)

	// 5. Determine Subject
	subject := "We received your service request!"
	if appointment.IsCommercial {
		subject = "We received your commercial service request!"
	}

	// 6. Send Email
	emailService := NewSendEmailService()
	err := emailService.SendEmail(appointment.Email, subject, htmlBody)
	if err != nil {
		return fmt.Errorf("error sending confirmation email to %s: %w", appointment.Email, err)
	}

	return nil
}
