const contactService = require('../../src/services/contactService');
const contactRepo = require('../../src/repositories/contactRepository');

jest.mock('../../src/repositories/contactRepository');

describe('Contact Business Logic (Service)', () => {
    let mockContact;

    beforeEach(() => {
        jest.clearAllMocks();
        mockContact = { id: 1, phoneNumber: '555-0199', email: 'test@example.com' };
    });

    describe('Fetching Contacts', () => {
        it('should return all contacts from the repository', async () => {
            contactRepo.findAll.mockResolvedValue([mockContact]);
            const results = await contactService.getContacts();

            expect(contactRepo.findAll).toHaveBeenCalled();
            expect(results).toEqual([mockContact]);
        });
    });

    describe('Managing Contact Records', () => {
        it('should create a new contact record', async () => {
            const data = { phoneNumber: '555-0199', email: 'test@example.com' };
            contactRepo.create.mockResolvedValue(mockContact);

            const result = await contactService.createContact(data);

            expect(contactRepo.create).toHaveBeenCalledWith(data);
            expect(result).toEqual(mockContact);
        });

        it('should update an existing contact', async () => {
            const updateData = { email: 'new@example.com' };
            contactRepo.update.mockResolvedValue({ ...mockContact, ...updateData });

            const result = await contactService.updateContact(1, updateData);

            expect(contactRepo.update).toHaveBeenCalledWith(1, updateData);
            expect(result.email).toBe('new@example.com');
        });

        it('should handle deleting a contact', async () => {
            contactRepo.deleteContact.mockResolvedValue(true);
            const result = await contactService.deleteContact(1);

            expect(contactRepo.deleteContact).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });
    });

    describe('createContact with duplicate protection', () => {
        it('should return the existing contact if all fields match', async () => {
            const duplicateData = { name: 'Jane Doe', email: 'test@example.com', phoneNumber: '555-0199' };

            // Mock the repo to simulate finding an existing record
            contactRepo.create.mockResolvedValue(mockContact);

            const result = await contactService.createContact(duplicateData);

            expect(contactRepo.create).toHaveBeenCalledWith(duplicateData);
            expect(result).toEqual(mockContact);
        });
    });
});