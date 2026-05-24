const { transporter } = require('../transporter');
const { cancellationHeader, standardFooter } = require('../../../utils/emailBranding');

const sendDenialEmail = async (appointment, customMessage = '') => {
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
                    Thank you for reaching out to Amend Landscaping. Unfortunately, we are <strong>unable to fulfill your service request</strong> at this time. 
                    This can sometimes be due to our current scheduling capacity, service area constraints, or the specific nature of the request.
                </p>
                
                ${customMessageHtml}
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We sincerely appreciate your interest in our services and hope we might have the opportunity to serve you in the future.
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
        subject: 'Update Regarding Your Amend Landscaping Request',
        html: htmlBody
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Denial email sent successfully to ${appointment.email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending denial email:', error);
        return false;
    }
};

module.exports = {
    sendDenialEmail
};