package service

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"email-service-api/internal/model"
	"email-service-api/pkg/utils"
)

type AdminNotificationEmailService struct{}

func NewAdminNotificationEmailService() *AdminNotificationEmailService {
	return &AdminNotificationEmailService{}
}

func (s *AdminNotificationEmailService) SendAdminNotificationEmail(appointment model.Appointment, adminEmail string) error {
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

	// 3. Commercial formatting & styling
	commercialTag := ""
	propertyTypeText := "Residential Property 🏠"
	borderColor := "#16a34a"
	if appointment.IsCommercial {
		commercialTag = "<strong>COMMERCIAL</strong> "
		propertyTypeText = "COMMERCIAL PROPERTY 🏢"
		borderColor = "#2563eb"
	}

	// 4. Optional Fields
	phoneStr := "Not provided"
	if appointment.PhoneNumber != nil && strings.TrimSpace(*appointment.PhoneNumber) != "" {
		phoneStr = *appointment.PhoneNumber
	}

	notesHtml := ""
	if appointment.Description != nil && strings.TrimSpace(*appointment.Description) != "" {
		notesHtml = fmt.Sprintf(`<p style="color: #475569; margin: 10px 0;"><strong>Additional Notes:</strong> %s</p>`, *appointment.Description)
	}

	// Construct full address string cleanly
	addressParts := []string{appointment.Address}
	if appointment.City != nil && *appointment.City != "" {
		addressParts = append(addressParts, *appointment.City)
	}
	if appointment.State != nil && *appointment.State != "" {
		addressParts = append(addressParts, *appointment.State)
	}
	if appointment.Zip != nil && *appointment.Zip != "" {
		addressParts = append(addressParts, *appointment.Zip)
	}
	fullAddress := strings.Join(addressParts, ", ")

	// 5. Construct HTML Body
	htmlBody := fmt.Sprintf(`
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            %s
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;"><strong>Hello Team,</strong></p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    A new %sservice appointment request has just been submitted via the website. Below are the details of the request:
                </p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid %s; margin: 24px 0;">
                    <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Customer Details</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Name:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Email:</strong> <a href="mailto:%s" style="color: #16a34a; text-decoration: none;">%s</a></p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Phone:</strong> %s</p>
                    
                    <h3 style="color: #0f172a; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Request Details</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Property Type:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Requested Date:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Address:</strong> %s</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Services Requested:</strong> %s</p>
                    %s
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    You can review, approve, or deny this request by logging into your admin dashboard.
                </p>
                
                <p style="color: #334155; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                    System Notification<br>
                    Amend Landscaping
                </p>
            </div>

            %s
        </div>
    `,
		utils.BookingHeader,
		commercialTag,
		borderColor,
		appointment.Name,
		appointment.Email,
		appointment.Email,
		phoneStr,
		propertyTypeText,
		appointmentDate,
		fullAddress,
		servicesList,
		notesHtml,
		utils.StandardFooter(),
	)

	// 6. Determine Subject
	subject := fmt.Sprintf("New Service Request: %s", appointment.Name)
	if appointment.IsCommercial {
		subject = fmt.Sprintf("⚠️ NEW COMMERCIAL REQUEST: %s", appointment.Name)
	}

	// 7. Initialize Email Service and send
	emailService := NewSendEmailService()
	err := emailService.SendEmail(adminEmail, subject, htmlBody)
	if err != nil {
		return fmt.Errorf("error sending admin notification email to %s: %w", adminEmail, err)
	}

	return nil
}
