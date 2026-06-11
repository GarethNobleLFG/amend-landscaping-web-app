const { transporter } = require('../transporter');
const { bookingHeader, standardFooter, brandAttachments } = require('../../../utils/emailBranding');

const sendConfirmationEmail = async (appointment) => {
    const isCommercial = !!appointment.is_commercial;
    const dateToUse = appointment.scheduledDate || appointment.createdAt;
    const appointmentDate = dateToUse ? new Date(dateToUse).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'TBD';

    let servicesList = 'None specified';
    if (appointment.servicesRequested) {
        const servicesObj = typeof appointment.servicesRequested === 'string'
            ? JSON.parse(appointment.servicesRequested)
            : appointment.servicesRequested;

        servicesList = Object.keys(servicesObj)
            .filter(key => servicesObj[key])
            .map(s => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()))
            .join(', ');
    }

    const htmlBody = `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            ${bookingHeader}
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;">Dear ${appointment.name},</p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for reaching out to Amend Landscaping! We have successfully received your ${isCommercial ? 'commercial ' : ''}service request. 
                </p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    <strong>What happens next?</strong><br>
                    A member of our team is reviewing your request and will be reaching out to you shortly to finalize details and officially approve your ${isCommercial ? 'commercial ' : ''}appointment.
                </p>
                
                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Your Request Summary</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Requested Date:</strong> ${appointmentDate}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Address:</strong> ${appointment.address}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Services Requested:</strong> ${servicesList}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Property Type:</strong> ${isCommercial ? 'Commercial Property' : 'Residential Property'}</p>
                    ${appointment.notes ? `<p style="color: #475569; margin: 10px 0;"><strong>Additional Notes:</strong> ${appointment.notes}</p>` : ''}
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    If you need to make any changes to this request in the meantime, please feel free to reply directly to this email.
                </p>
                
                <p style="color: #334155; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                    Warm regards,<br>
                    The Amend Landscaping Team
                </p>
            </div>

            ${standardFooter}
        </div>
    `;

    const mailOptions = {
        from: `"Amend Landscaping"`,
        to: appointment.email,
        subject: isCommercial 
            ? 'We received your commercial service request!' 
            : 'We received your service request!',
        html: htmlBody,
        attachments: brandAttachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent successfully to ${appointment.email}: ${info.messageId}`);
        return true;
    } 
    catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
};

module.exports = {
    sendConfirmationEmail
};