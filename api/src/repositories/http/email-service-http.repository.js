const API_BASE = process.env.EMAIL_SERVICE_URL || "http://email-service-api:8081";

async function sendConfirmationEmail(appointment) {
    try {
        const response = await fetch(`${API_BASE}/api/emails/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ appointment }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Email service returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Confirmation email sent successfully:", data.message);
        return true;
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        throw error;
    }
}

async function sendAdminNotificationEmail(appointment, adminEmail = null) {
    try {
        const payload = { appointment };
        if (adminEmail) {
            payload.admin_email = adminEmail;
        }

        const response = await fetch(`${API_BASE}/api/emails/notify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Email service returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Admin notification email sent successfully:", data.message);
        return true;
    } catch (error) {
        console.error("Error sending admin notification email:", error);
        throw error;
    }
}

module.exports = {
    sendConfirmationEmail,
    sendAdminNotificationEmail,
};