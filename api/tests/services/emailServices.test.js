const { sendApprovalEmail } = require('../../src/services/email-services/service-types/approve');
const { sendDenialEmail } = require('../../src/services/email-services/service-types/deny');
const { sendCancellationEmail } = require('../../src/services/email-services/service-types/cancel');
const { sendAdminNotificationEmail } = require('../../src/services/email-services/service-types/notify');
const { sendConfirmationEmail } = require('../../src/services/email-services/service-types/confirm');

jest.mock('../../src/services/email-services/transporter', () => ({
    transporter: {
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    }
}));

const { transporter } = require('../../src/services/email-services/transporter');

describe('Email Services (Template Generation and Sending)', () => {
    let fullAppointment;
    let minimalAppointment;
    let commercialAppointment;

    beforeEach(() => {
        jest.clearAllMocks();

        // Suppress console logs/errors from cluttering test output
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });

        fullAppointment = {
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 Lawn St',
            phoneNumber: '555-555-5555', 
            servicesRequested: JSON.stringify({ mowing: true, mulching: true, aeration: false }),
            description: 'Gate is unlocked.', 
            city: 'Fort Wayne', 
            state: 'IN',
            zip: '46802',
            scheduledDate: '2026-06-01T10:00:00.000Z',
            createdAt: '2026-05-01T10:00:00.000Z',
            is_commercial: false
        };

        commercialAppointment = {
            name: 'Acme Corp',
            email: 'facilities@acme.com',
            address: '999 Business Pkwy',
            phoneNumber: '555-999-9999', 
            servicesRequested: JSON.stringify({ mowing: true, fertilization: true }),
            description: 'Main courtyard gate.',
            city: 'Fort Wayne',
            state: 'IN',
            zip: '46804',
            scheduledDate: '2026-06-15T08:00:00.000Z',
            createdAt: '2026-05-15T08:00:00.000Z',
            is_commercial: true
        };
        minimalAppointment = {
            name: 'Jane Smith',
            email: 'jane@example.com',
            address: '456 Garden Ave',
            createdAt: '2026-05-02T10:00:00.000Z',
            is_commercial: false
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('sendApprovalEmail', () => {
        it('should successfully generate and send an email with full data', async () => {
            const result = await sendApprovalEmail(fullAppointment, 'Custom approval message');

            expect(result).toBe(true);
            expect(transporter.sendMail).toHaveBeenCalled();

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.to).toBe('john@example.com');
            expect(mailOptions.subject).toBe('Your Amend Landscaping Appointment is Approved!');
            expect(mailOptions.html).toContain('Mowing, Mulching'); // Parses JSON safely
            expect(mailOptions.html).toContain('Custom approval message');
            expect(mailOptions.html).toContain('Residential Property');
            expect(mailOptions.html).not.toContain('commercial');
        });

        it('should generate a commercial-themed approval email for commercial properties', async () => {
            const result = await sendApprovalEmail(commercialAppointment, 'Approved for commercial routine care');

            expect(result).toBe(true);
            expect(transporter.sendMail).toHaveBeenCalled();

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.to).toBe('facilities@acme.com');
            expect(mailOptions.subject).toBe('Your Commercial Amend Landscaping Service is Approved!');
            expect(mailOptions.html).toContain('Approved for commercial routine care');
            expect(mailOptions.html).toContain('Commercial Appointment Details');
            expect(mailOptions.html).toContain('Commercial Property');
            expect(mailOptions.html).toContain('commercial space');
        });

        it('should NOT crash if servicesRequested and scheduledDate are missing', async () => {
            const result = await sendApprovalEmail(minimalAppointment);

            expect(result).toBe(true);
            expect(transporter.sendMail).toHaveBeenCalled();

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.to).toBe('jane@example.com');
            expect(mailOptions.html).toContain('None specified'); // Fallback text safely applied
        });
    });

    describe('sendConfirmationEmail', () => {
        it('should successfully handle full appointment data', async () => {
            const result = await sendConfirmationEmail(fullAppointment);
            expect(result).toBe(true);
            expect(transporter.sendMail).toHaveBeenCalled();

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('We received your service request!');
            expect(mailOptions.html).toContain('Residential Property');
        });

        it('should generate a commercial confirmation email if the property is commercial', async () => {
            const result = await sendConfirmationEmail(commercialAppointment);
            expect(result).toBe(true);
            expect(transporter.sendMail).toHaveBeenCalled();

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('We received your commercial service request!');
            expect(mailOptions.html).toContain('commercial service request');
            expect(mailOptions.html).toContain('commercial appointment');
            expect(mailOptions.html).toContain('Commercial Property');
        });

        it('should NOT crash if optional fields are missing', async () => {
            const result = await sendConfirmationEmail(minimalAppointment);
            expect(result).toBe(true);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.html).toContain('None specified');
            expect(mailOptions.html).not.toContain('Additional Notes'); // Conditional rendering works
        });
    });

    describe('sendAdminNotificationEmail', () => {
        it('should default to sending to SMTP_USER or ADMIN_EMAIL', async () => {
            await sendAdminNotificationEmail(fullAppointment);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.replyTo).toBe('john@example.com'); // Admin can hit reply to email customer
            expect(mailOptions.html).toContain('Gate is unlocked.');
            expect(mailOptions.html).toContain('Residential Property 🏠');
            expect(mailOptions.subject).toBe('New Service Request: John Doe');
        });

        it('should format notification to indicate commercial classification', async () => {
            await sendAdminNotificationEmail(commercialAppointment);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('⚠️ NEW COMMERCIAL REQUEST: Acme Corp');
            expect(mailOptions.html).toContain('COMMERCIAL');
            expect(mailOptions.html).toContain('COMMERCIAL PROPERTY 🏢');
            expect(mailOptions.html).toContain('border-left: 4px solid #2563eb'); // Commercial color
        });

        it('should NOT crash if optional fields are missing', async () => {
            const result = await sendAdminNotificationEmail(minimalAppointment);
            expect(result).toBe(true);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.html).toContain('None specified');
            expect(mailOptions.html).not.toContain('Gate is unlocked');
        });
    });

    describe('sendDenialEmail', () => {
        it('should safely process a denial with custom message', async () => {
            const result = await sendDenialEmail(minimalAppointment, 'Out of service area');
            expect(result).toBe(true);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('Update Regarding Your Amend Landscaping Request');
            expect(mailOptions.html).toContain('Out of service area');
        });

        it('should adapt denial subject and body text for commercial applications', async () => {
            const result = await sendDenialEmail(commercialAppointment, 'Out of service area');
            expect(result).toBe(true);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('Update Regarding Your Commercial Landscaping Request');
            expect(mailOptions.html).toContain('commercial service request');
            expect(mailOptions.html).toContain('serve you and your business');
        });
    });

    describe('sendCancellationEmail', () => {
        it('should safely process a cancellation with full or minimal data', async () => {
            const result = await sendCancellationEmail(minimalAppointment, 'Client requested cancellation');
            expect(result).toBe(true);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('Cancellation of Your Amend Landscaping Appointment');
            expect(mailOptions.html).toContain('Client requested cancellation');
            expect(mailOptions.html).toContain('2026');
        });

        it('should adapt cancellation message for commercial jobs', async () => {
            const result = await sendCancellationEmail(commercialAppointment, 'Job post-poned due to development delay');
            expect(result).toBe(true);

            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.subject).toBe('Cancellation of Your Commercial Amend Landscaping Appointment');
            expect(mailOptions.html).toContain('commercial service appointment');
            expect(mailOptions.html).toContain('Cancelled Commercial Appointment Details');
        });
    });
});