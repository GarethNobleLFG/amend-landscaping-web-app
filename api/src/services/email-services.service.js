const emailRepository = require('../repositories/http/email-service-http.repository');

async function triggerConfirmationEmail(appointment) {
    if (!appointment || !appointment.email) {
        throw new Error("Appointment data is missing or invalid (email is required).");
    }

    try {
        console.log(`Triggering confirmation email for: ${appointment.email}`);
        await emailRepository.sendConfirmationEmail(appointment);
        return true;
    } catch (error) {
        console.error("Failed in confirmation email service:", error.message);
        throw error;
    }
}

async function triggerAdminNotification(appointment, adminEmail = null) {
    if (!appointment || !appointment.name) {
        throw new Error("Appointment data is missing or invalid (name is required).");
    }

    try {
        console.log(`Triggering admin notification for appointment: ${appointment.name}`);
        await emailRepository.sendAdminNotificationEmail(appointment, adminEmail);
        return true;
    } catch (error) {
        console.error("Failed in admin notification email service:", error.message);
        throw error;
    }
}

module.exports = {
    triggerConfirmationEmail,
    triggerAdminNotification,
};