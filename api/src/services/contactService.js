const contactRepo = require('../repositories/contactRepository');

const createContact = async (data) => {
    return await contactRepo.create(data);
};

const getContacts = async () => {
    return await contactRepo.findAll();
};

const getContactById = async (id) => {
    return await contactRepo.findById(id);
};

const updateContact = async (id, data) => {
    return await contactRepo.update(id, data);
};

const deleteContact = async (id) => {
    return await contactRepo.deleteContact(id);
};

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
};