import { useState, useEffect } from 'react';
import { useContacts } from '../hooks/contactHooks';
import { Edit2, Trash2, Save, X, Plus, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactsTab = () => {
    const { contacts, isLoading, fetchContacts, addContact, updateContact, deleteContact } = useContacts();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phoneNumber: '', email: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchContacts(); }, [fetchContacts]);

    const filteredContacts = contacts.filter(contact => {
        if (!searchTerm.trim()) return true;

        const search = searchTerm.toLowerCase();
        return (
            contact.name.toLowerCase().includes(search) ||
            contact.email.toLowerCase().includes(search) ||
            contact.phoneNumber.toLowerCase().includes(search)
        );
    });

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Client Directory</h2>
                    <p className="text-gray-500 text-sm font-medium">Manage your saved contacts and leads</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-grow md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search name, email, or phone..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all text-sm bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-600 transition-all shadow-md active:scale-95 shrink-0"
                    >
                        <Plus className="w-5 h-5" /> Add Contact
                    </button>
                </div>
            </div>

            {/* Quick Add Row */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        className="bg-green-50/50 border-2 border-green-200 rounded-3xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-sm"
                    >
                        <div>
                            <label className="text-[10px] font-black text-green-800 uppercase mb-1.5 block tracking-widest">Full Name</label>
                            <input className="w-full rounded-xl border-gray-200 p-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 border shadow-inner" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-green-800 uppercase mb-1.5 block tracking-widest">Phone</label>
                            <input className="w-full rounded-xl border-gray-200 p-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 border shadow-inner" value={newContact.phoneNumber} onChange={e => setNewContact({ ...newContact, phoneNumber: e.target.value })} placeholder="(260) 000-0000" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-green-800 uppercase mb-1.5 block tracking-widest">Email</label>
                            <input className="w-full rounded-xl border-gray-200 p-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 border shadow-inner" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} placeholder="jane@example.com" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleAddNew} className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl text-sm hover:bg-green-600 shadow-md">Save Client</button>
                            <button onClick={() => setIsAdding(false)} className="px-3 py-3 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contacts Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan="4" className="py-24 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-green-700 opacity-20" /></td></tr>
                        ) : filteredContacts.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-24 text-center">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-medium">
                                        {searchTerm
                                            ? `No results found for "${searchTerm}"`
                                            : "Start typing to search your client directory..."}
                                    </p>
                                </td>
                            </tr>
                        ) : filteredContacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    {editingId === contact.id ? (
                                        <input className="w-full rounded-lg border-gray-200 p-2 text-sm focus:ring-2 focus:ring-green-500/20 border" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs ring-4 ring-green-50">{contact.name.charAt(0)}</div>
                                            <span className="font-bold text-gray-900">{contact.name}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                                    {editingId === contact.id ? (
                                        <input className="w-full rounded-lg border-gray-200 p-2 text-sm focus:ring-2 focus:ring-green-500/20 border" value={editForm.phoneNumber} onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })} />
                                    ) : contact.phoneNumber}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                                    {editingId === contact.id ? (
                                        <input className="w-full rounded-lg border-gray-200 p-2 text-sm focus:ring-2 focus:ring-green-500/20 border" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                    ) : contact.email}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === contact.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleSave(contact.id)} className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors"><Save className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button title="Edit" onClick={() => handleStartEdit(contact)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button title="Delete" onClick={() => deleteContact(contact.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default ContactsTab;