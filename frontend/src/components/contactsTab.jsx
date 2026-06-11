import { useState, useEffect } from 'react';
import { useContacts } from '../hooks/contactHooks';
import { Edit2, Trash2, Save, X, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactsTab = () => {
    const { contacts, isLoading, fetchContacts, addContact, updateContact, deleteContact } = useContacts();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phoneNumber: '', email: '' });

    useEffect(() => { fetchContacts(); }, [fetchContacts]);

    const handleStartEdit = (contact) => {
        setEditingId(contact.id);
        setEditForm({ ...contact });
    };

    const handleSave = async (id) => {
        if (await updateContact(id, editForm)) setEditingId(null);
    };

    const handleAddNew = async () => {
        if (await addContact(newContact)) {
            setIsAdding(false);
            setNewContact({ name: '', phoneNumber: '', email: '' });
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Client Directory</h2>
                    <p className="text-gray-500 text-sm">Manage your saved contacts and leads</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition-all shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Add New Contact
                </button>
            </div>

            {/* Quick Add Row */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm"
                    >
                        <div>
                            <label className="text-xs font-bold text-green-800 uppercase mb-1 block">Full Name</label>
                            <input className="w-full rounded-lg border-gray-200 p-2 text-sm focus:ring-green-500 border" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-green-800 uppercase mb-1 block">Phone</label>
                            <input className="w-full rounded-lg border-gray-200 p-2 text-sm focus:ring-green-500 border" value={newContact.phoneNumber} onChange={e => setNewContact({...newContact, phoneNumber: e.target.value})} placeholder="(260) 000-0000" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-green-800 uppercase mb-1 block">Email</label>
                            <input className="w-full rounded-lg border-gray-200 p-2 text-sm focus:ring-green-500 border" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} placeholder="jane@example.com" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleAddNew} className="flex-1 bg-green-700 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-600">Save</button>
                            <button onClick={() => setIsAdding(false)} className="px-3 py-2 text-gray-500 hover:bg-gray-200 rounded-lg"><X className="w-5 h-5"/></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contacts Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-700"/></td></tr>
                        ) : contacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    {editingId === contact.id ? (
                                        <input className="border rounded p-1 text-sm w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">{contact.name.charAt(0)}</div>
                                            <span className="font-semibold text-gray-900">{contact.name}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {editingId === contact.id ? (
                                        <input className="border rounded p-1 text-sm w-full" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} />
                                    ) : contact.phoneNumber}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm text">
                                    {editingId === contact.id ? (
                                        <input className="border rounded p-1 text-sm w-full" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                                    ) : contact.email}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === contact.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleSave(contact.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Save className="w-4 h-4"/></button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4"/></button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleStartEdit(contact)} className="p-1.5 text-gray-400 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                                            <button onClick={() => deleteContact(contact.id)} className="p-1.5 text-gray-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactsTab;