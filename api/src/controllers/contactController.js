const contactService = require('../services/contactService');

const create = async (req, res) => {
    try {
        const contact = await contactService.createContact(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contact' });
    }
};

const getAll = async (req, res) => {
    try {
        const contacts = await contactService.getContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

const update = async (req, res) => {
    try {
        const updated = await contactService.updateContact(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: 'Contact not found' });
        res.json(updated);
    } 
    catch {
        res.status(500).json({ error: 'Update failed' });
    }
};

const deleteContact = async (req, res) => {
    try {
        await contactService.deleteContact(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Deletion failed' });
    }
};

module.exports = {
    create,
    getAll,
    update,
    deleteContact
};