import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, CheckCircle, Clock, XCircle, History, Building, User, Edit2, Save, X, Loader2 } from 'lucide-react'; // Added Loader2
import { useGetAvailableServices } from '../hooks/serviceHooks';
import { useMarkAppointmentAsSeen } from '../hooks/appointmentHooks';

const AppointmentCard = ({ appointment, onApprove, onDeny, onCancel, onUpdate, onUpdateSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...appointment });

    const { markAsSeen } = useMarkAppointmentAsSeen();

    const handleMouseEnter = async () => {
        if (!appointment.is_seen) {
            const result = await markAsSeen(appointment.id);
            if (result.success && onUpdateSuccess) {
                onUpdateSuccess();
            }
        }
    };

    const { services: allSystemServices, fetchServices, isLoading: servicesLoading } = useGetAvailableServices();

    useEffect(() => {
        if (isEditing) fetchServices();
    }, [isEditing, fetchServices]);

    // This replaces the useEffect and fixes the cascading render error
    const handleStartEditing = () => {
        setFormData({ ...appointment });
        setIsEditing(true);
    };

    const handleSave = async () => {
        const result = await onUpdate(appointment.id, formData);
        if (result.success) {
            setIsEditing(false);
            if (onUpdateSuccess) onUpdateSuccess();
        } else {
            alert("Failed to save: " + (result.error || "Unknown error"));
        }
    };

    const handleServiceToggle = (serviceName) => {
        const key = serviceName.toLowerCase().replace(/\s+/g, '_');
        setFormData(prev => ({
            ...prev,
            servicesRequested: {
                ...prev.servicesRequested,
                [key]: !prev.servicesRequested?.[key]
            }
        }));
    };

    const formatKey = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const servicesDisplay = Object.entries(appointment.servicesRequested || {})
        .filter(([, isRequested]) => isRequested === true || isRequested === "true")
        .map(([name]) => formatKey(name))
        .join(', ') || 'None specified';

    const formattedSubmissionTime = new Date(appointment.createdAt).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            whileHover={!isEditing ? { y: -4 } : {}}
            onClick={handleMouseEnter}
            className={`bg-white rounded-2xl shadow-sm border transition-all p-6 flex flex-col h-full relative overflow-hidden ${isEditing ? 'border-green-400 ring-2 ring-green-100 scale-[1.02] z-30' : 'border-gray-100 hover:shadow-lg'
                }`}
        >
            {/* Optional: Add a "New" Pulse indicator inside the card */}
            {!appointment.is_seen && (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            )}

            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${appointment.is_commercial ? 'from-blue-500 to-indigo-600' : appointment.approved ? 'from-green-500 to-green-600' : 'from-yellow-400 to-yellow-500'
                }`}></div>

            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow text-left">
                        {isEditing ? (
                            <input
                                className="text-xl font-bold text-gray-900 border-b-2 border-green-200 outline-none w-full bg-green-50/30 px-1"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        ) : (
                            <h3 className="text-xl font-bold text-gray-900">{appointment.name}</h3>
                        )}
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleStartEditing}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors ml-2"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Badges/Toggles */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${appointment.approved ? 'text-green-700 bg-green-50 border-green-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200'
                        }`}>
                        {appointment.approved ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {appointment.approved ? 'Approved' : 'Pending'}
                    </span>
                    <button
                        disabled={!isEditing}
                        onClick={() => setFormData({ ...formData, is_commercial: !formData.is_commercial })}
                        className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${formData.is_commercial ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-teal-700 bg-teal-50 border-teal-200'
                            } ${isEditing ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}`}
                    >
                        {formData.is_commercial ? <Building className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                        {formData.is_commercial ? 'Commercial' : 'Residential'}
                    </button>
                </div>

                {/* Contact & Location Info */}
                <div className="space-y-3 mb-6 text-left">
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Phone className="w-4 h-4 mr-3 text-green-600 shrink-0" />
                        {isEditing ? (
                            <input
                                className="border-b border-gray-200 outline-none w-full bg-gray-50/50"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        ) : appointment.phoneNumber}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Mail className="w-4 h-4 mr-3 text-green-600 shrink-0" />
                        {isEditing ? (
                            <input
                                className="border-b border-gray-200 outline-none w-full bg-gray-50/50"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        ) : appointment.email}
                    </div>
                    <div className="flex items-start text-gray-600 text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-3 text-green-600 mt-1 shrink-0" />
                        <div className="w-full space-y-1">
                            {isEditing ? (
                                <div className="space-y-1">
                                    <input placeholder="Street" className="border-b border-gray-200 outline-none w-full bg-gray-50/50" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                    <div className="flex gap-2">
                                        <input placeholder="City" className="border-b border-gray-200 outline-none w-1/2 bg-gray-50/50 text-xs" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                        <input placeholder="ST" className="border-b border-gray-200 outline-none w-1/4 bg-gray-50/50 text-xs" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                                        <input placeholder="Zip" className="border-b border-gray-200 outline-none w-1/4 bg-gray-50/50 text-xs" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} />
                                    </div>
                                </div>
                            ) : (
                                <span>{appointment.address}, <br />{appointment.city}, {appointment.state} {appointment.zip}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="pt-4 border-t border-gray-100 text-left">
                    <p className="text-sm text-gray-500 mb-2 font-semibold uppercase tracking-wider">Requested Services</p>
                    {isEditing ? (
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {servicesLoading ? (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Loading system services...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-y-2">
                                    {allSystemServices.map(service => {
                                        const key = service.name.toLowerCase().replace(/\s+/g, '_');
                                        const isChecked = !!formData.servicesRequested?.[key];
                                        return (
                                            <label
                                                key={service.id}
                                                className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-colors ${isChecked ? 'bg-green-100/50 shadow-sm' : 'hover:bg-gray-100'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleServiceToggle(service.name)}
                                                    className="accent-green-700 w-4 h-4"
                                                />
                                                <span className={`text-xs font-semibold ${isChecked ? 'text-green-900' : 'text-gray-600'}`}>
                                                    {service.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-800 font-medium">{servicesDisplay}</p>
                    )}
                </div>

                {/* Notes/Description */}
                {(appointment.description || isEditing) && (
                    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 text-left">
                        {isEditing ? (
                            <textarea
                                className="w-full bg-transparent outline-none text-sm text-gray-600 italic border-b border-green-200 min-h-[60px]"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Additional notes..."
                            />
                        ) : (
                            <p className="text-sm text-gray-600 italic">"{appointment.description}"</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                {!isEditing ? (
                    <>
                        <div className="flex items-center justify-center text-gray-500 text-xs font-medium mb-4">
                            <History className="w-3.5 h-3.5 mr-1.5" /> Submitted: {formattedSubmissionTime} ET
                        </div>
                        <div className="flex flex-row gap-3">
                            {!appointment.approved ? (
                                <>
                                    <button onClick={() => onDeny(appointment.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 transition-all active:scale-[0.98]">
                                        <XCircle className="w-5 h-5" /> Deny
                                    </button>
                                    <button onClick={() => onApprove(appointment.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-green-700 hover:bg-green-600 text-white shadow-sm active:scale-[0.98]">
                                        <CheckCircle className="w-5 h-5" /> Approve
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => onCancel(appointment.id)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 transition-all active:scale-[0.98]">
                                    <XCircle className="w-5 h-5" /> Cancel Appointment
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => { setIsEditing(false); setFormData({ ...appointment }); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                            <X className="w-5 h-5" /> Discard
                        </button>
                        <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-green-700 text-white hover:bg-green-600 shadow-sm">
                            <Save className="w-5 h-5" /> Save
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AppointmentCard;