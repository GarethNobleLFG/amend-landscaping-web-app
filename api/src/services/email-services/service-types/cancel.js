const { transporter } = require('../transporter');
const { cancellationHeader, standardFooter, brandAttachments } = require('../../../utils/emailBranding');

const sendCancellationEmail = async (appointment, customMessage = '') => {
    const isCommercial = !!appointment.is_commercial;
    const dateToUse = appointment.scheduledDate || appointment.createdAt;
    const appointmentDate = dateToUse ? new Date(dateToUse).toLocaleDateString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    }) : 'TBD';

    const customMessageHtml = customMessage.trim() !== '' ? `
        <div style="background-color: #f8fafc; border-left: 4px solid #dc2626; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">A message from our team:</p>
            <p style="color: #1e293b; font-size: 16px; margin: 0; line-height: 1.5; font-style: italic;">"${customMessage}"</p>
        </div>
    ` : '';

    const htmlBody = `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            ${cancellationHeader}
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;">Dear ${appointment.name},</p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We are writing to inform you that your upcoming ${isCommercial ? 'commercial ' : ''}service appointment with Amend Landscaping has been <strong>cancelled</strong>.
                </p>
                
                ${customMessageHtml}

                <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h3 style="color: #991b1b; margin-top: 0; border-bottom: 1px solid #fecaca; padding-bottom: 10px;">Cancelled ${isCommercial ? 'Commercial ' : ''}Appointment Details</h3>
                    <p style="color: #7f1d1d; margin: 10px 0;"><strong>Date:</strong> ${appointmentDate}</p>
                    <p style="color: #7f1d1d; margin: 10px 0;"><strong>Address:</strong> ${appointment.address}</p>
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    If this cancellation was in error or if you would like to reschedule with us for a later date, please don't hesitate to reach out. We apologize for any inconvenience this may cause.
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
        from: `"Amend Landscaping" <${process.env.SMTP_USER}>`,
        to: appointment.email,
        subject: isCommercial 
            ? 'Cancellation of Your Commercial Amend Landscaping Appointment' 
            : 'Cancellation of Your Amend Landscaping Appointment',
        html: htmlBody,
        attachments: brandAttachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Cancellation email sent successfully to ${appointment.email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending cancellation email:', error);
        return false;
    }
};

module.exports = {
    sendCancellationEmail
};