const { transporter } = require('../transporter');
const { bookingHeader, standardFooter } = require('../../../utils/emailBranding');

const sendAdminNotificationEmail = async (appointment) => {
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
                <p style="color: #334155; font-size: 18px; margin-top: 0;"><strong>Hello Team,</strong></p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    A new ${isCommercial ? '<strong>COMMERCIAL</strong> ' : ''}service appointment request has just been submitted via the website. Below are the details of the request:
                </p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${isCommercial ? '#2563eb' : '#16a34a'}; margin: 24px 0;">
                    <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Customer Details</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Name:</strong> ${appointment.name}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${appointment.email}" style="color: #16a34a; text-decoration: none;">${appointment.email}</a></p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Phone:</strong> ${appointment.phoneNumber}</p>
                    
                    <h3 style="color: #0f172a; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Request Details</h3>
                    <p style="color: #475569; margin: 10px 0;"><strong>Property Type:</strong> ${isCommercial ? 'COMMERCIAL PROPERTY 🏢' : 'Residential Property 🏠'}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Requested Date:</strong> ${appointmentDate}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Address:</strong> ${appointment.address}, ${appointment.city}, ${appointment.state} ${appointment.zip}</p>
                    <p style="color: #475569; margin: 10px 0;"><strong>Services Requested:</strong> ${servicesList}</p>
                    ${appointment.description ? `<p style="color: #475569; margin: 10px 0;"><strong>Additional Notes:</strong> ${appointment.description}</p>` : ''}
                </div>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    You can review, approve, or deny this request by logging into your admin dashboard.
                </p>
                
                <p style="color: #334155; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                    System Notification<br>
                    Amend Landscaping
                </p>
            </div>

            ${standardFooter}
        </div>
    `;

    const ownerEmail = process.env.ADMIN_EMAIL;

    const mailOptions = {
        from: `"Amend Landscaping Website"`,
        to: ownerEmail,
        replyTo: appointment.email,
        subject: isCommercial
            ? `⚠️ NEW COMMERCIAL REQUEST: ${appointment.name}`
            : `New Service Request: ${appointment.name}`,
        html: htmlBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Admin notification email sent successfully to ${ownerEmail}: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error('Error sending admin notification email:', error);
        return false;
    }
};

module.exports = {
    sendAdminNotificationEmail
};