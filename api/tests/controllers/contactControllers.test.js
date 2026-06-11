const request = require('supertest');
const express = require('express');
const contactRoutes = require('../../src/routes/contactRoutes');
const contactService = require('../../src/services/contactService');

// Mock auth middleware to let tests pass without real tokens
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => next(),
    requireAdmin: (req, res, next) => next()
}));

jest.mock('../../src/services/contactService');

describe('Contact Controller Logic', () => {
    let app;
    let mockContact;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/contacts', contactRoutes);

        mockContact = { id: 1, name: 'Jane Doe', phoneNumber: '555-0199', email: 'test@example.com' };
    });

    describe('GET /contacts', () => {
        it('should return 200 and a list of contacts', async () => {
            contactService.getContacts.mockResolvedValue([mockContact]);

            const res = await request(app).get('/contacts');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([mockContact]);
        });
    });

    describe('POST /contacts', () => {
        it('should return 201 when a contact is created', async () => {
            contactService.createContact.mockResolvedValue(mockContact);

            const res = await request(app)
                .post('/contacts')
                .send({ name: 'Jane Doe', phoneNumber: '555-0199', email: 'test@example.com' });

            expect(res.status).toBe(201);
            expect(res.body.email).toBe('test@example.com');
        });
    });

    describe('PUT /contacts/:id', () => {
        it('should return 200 when update is successful', async () => {
            contactService.updateContact.mockResolvedValue({ ...mockContact, phoneNumber: 'new-num' });

            const res = await request(app)
                .put('/contacts/1')
                .send({ phoneNumber: 'new-num' });

            expect(res.status).toBe(200);
            expect(res.body.phoneNumber).toBe('new-num');
        });

        it('should return 404 if contact does not exist', async () => {
            contactService.updateContact.mockResolvedValue(null);

            const res = await request(app)
                .put('/contacts/999')
                .send({ phoneNumber: 'fails' });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /contacts/:id', () => {
        it('should return 204 on successful deletion', async () => {
            contactService.deleteContact.mockResolvedValue(true);

            const res = await request(app).delete('/contacts/1');

            expect(res.status).toBe(204);
        });
    });
});