const { transporter } = require('../transporter');
const { approvalHeader, standardFooter } = require('../../../utils/emailBranding');

const sendApprovalEmail = async (appointment, customMessage = '') => {
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

        servicesList = Object.keys(servicesObj).filter(key => servicesObj[key]).map(s => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ');
    }

    const customMessageHtml = customMessage.trim() !== '' ? `
        <div style="background-color: #f8fafc; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">A message from our team:</p>
            <p style="color: #1e293b; font-size: 16px; margin: 0; line-height: 1.5; font-style: italic;">"${customMessage}"</p>
        </div>
    ` : '';

    const htmlBody = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            ${approvalHeader}
            
            <div style="padding: 30px 20px; background-color: #ffffff;">
                <p style="color: #334155; font-size: 18px; margin-top: 0;">Dear ${appointment.name},</p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Thank you for choosing Amend Landscaping! We are thrilled to inform you that your service request has been reviewed and <strong>officially approved</strong> by our team.
                </p>
                
                ${customMessageHtml}
                
                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Appointment Details</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Date:</strong> ${appointmentDate}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Address:</strong> ${appointment.address}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Services Requested:</strong> ${servicesList}</p>
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    Our crew will arrive at the scheduled address prepared to deliver top-quality service. If you need to make any changes to this appointment, please contact us as soon as possible.
                </p>

                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We look forward to transforming your outdoor space!
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
        subject: 'Your Amend Landscaping Appointment is Approved!',
        html: htmlBody
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Approval email sent successfully to ${appointment.email}: ${info.messageId}`);
        return true;
    } 
    catch (error) {
        console.error('Error sending approval email:', error);
        return false;
    }
};

module.exports = {
    sendApprovalEmail
};
