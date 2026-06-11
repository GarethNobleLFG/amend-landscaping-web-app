const Contact = require('../models/contacts');

const create = async (contactData) => {
    const [contact] = await Contact.findOrCreate({
        where: {
            name: contactData.name,
            email: contactData.email,
            phoneNumber: contactData.phoneNumber
        },
        defaults: contactData 
    });

    return contact; 
};

const findAll = async () => {
    return await Contact.findAll();
};

const findById = async (id) => {
    return await Contact.findByPk(id);
};

const update = async (id, updateData) => {
    const contact = await Contact.findByPk(id);
    if (!contact) return null;
    return await contact.update(updateData);
};

const deleteContact = async (id) => {
    const contact = await Contact.findByPk(id);
    if (!contact) return null;
    return await contact.destroy();
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    deleteContact
};