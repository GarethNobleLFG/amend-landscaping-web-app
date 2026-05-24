// File: api/tests/services/emailServices.test.js

const { sendApprovalEmail } = require('../../src/services/email-services/service-types/approve');
const { sendDenialEmail } = require('../../src/services/email-services/service-types/deny');
const { sendCancellationEmail } = require('../../src/services/email-services/service-types/cancel');
const { sendAdminNotificationEmail } = require('../../src/services/email-services/service-types/notify');
const { sendConfirmationEmail } = require('../../src/services/email-services/service-types/confirm');

// Mock the Transporter to prevent real emails from sending
jest.mock('../../src/services/email-services/transporter', () => ({
    transporter: {
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    }
}));

const { transporter } = require('../../src/services/email-services/transporter');

describe('Email Services (Template Generation and Sending)', () => {
    let fullAppointment;
    let minimalAppointment;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Suppress console logs/errors from cluttering test output
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        fullAppointment = {
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 Lawn St',
            phone: '555-555-5555',
            servicesRequested: JSON.stringify({ mowing: true, mulching: true, aeration: false }),
            notes: 'Gate is unlocked.',
            scheduledDate: '2026-06-01T10:00:00.000Z',
            createdAt: '2026-05-01T10:00:00.000Z'
        };

        // Edge Case: Missing optional fields (No servicesRequested, notes, phone, or scheduledDate)
        minimalAppointment = {
            name: 'Jane Smith',
            email: 'jane@example.com',
            address: '456 Garden Ave',
            createdAt: '2026-05-02T10:00:00.000Z'
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
            expect(mailOptions.html).toContain('Mowing, Mulching'); // Parses JSON safely
            expect(mailOptions.html).toContain('Custom approval message');
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
            expect(mailOptions.html).toContain('Out of service area');
        });
    });

    describe('sendCancellationEmail', () => {
        it('should safely process a cancellation with full or minimal data', async () => {
            const result = await sendCancellationEmail(minimalAppointment, 'Client requested cancellation');
            expect(result).toBe(true);
            
            const mailOptions = transporter.sendMail.mock.calls[0][0];
            expect(mailOptions.html).toContain('Client requested cancellation');
            expect(mailOptions.html).toContain('2026'); 
        });
    });
});