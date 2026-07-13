import { motion } from 'framer-motion';
import {
    MapPin, Phone, Mail, CheckCircle, Clock, XCircle, History,
    Building, User, Edit2, Save, X, Loader2, Archive, Users
} from 'lucide-react';

const AppointmentCardUi = ({
    appointment,
    isEditing,
    formData,
    setFormData,
    setIsArchiveModalOpen,
    servicesLoading,
    allSystemServices,
    servicesDisplay,
    formattedSubmissionTime,
    handleMouseEnter,
    handleStartEditing,
    handleSave,
    handleServiceToggle,
    onApprove,
    onDeny,
    onCancel,
    setIsEditing
}) => {
    return (
        <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            whileHover={!isEditing && !appointment.is_archived ? { y: -4 } : {}}
            onMouseEnter={handleMouseEnter}
            className={`bg-white rounded-2xl shadow-sm border transition-all p-6 flex flex-col h-full relative overflow-hidden ${isEditing ? 'border-green-400 ring-2 ring-green-100 scale-[1.02] z-30' :
                appointment.is_archived ? 'border-gray-200 bg-gray-50/50 grayscale-[0.2]' :
                    'border-gray-100 hover:shadow-lg'
                }`}
        >
            {/* Pulse indicator - Only show if not archived */}
            {!appointment.is_seen && !appointment.is_archived && (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            )}

            {/* Top Border Gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${appointment.is_archived ? 'from-gray-400 to-gray-500' :
                appointment.is_commercial ? 'from-blue-500 to-indigo-600' :
                    appointment.approved ? 'from-green-500 to-green-600' :
                        'from-yellow-400 to-yellow-500'
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
                            <h3 className={`text-xl font-bold ${appointment.is_archived ? 'text-gray-500' : 'text-gray-900'}`}>
                                {appointment.name}
                            </h3>
                        )}
                    </div>
                    {!isEditing && (
                        <div className="flex gap-1 ml-2">
                            {!appointment.is_archived && appointment.approved && (
                                <button
                                    onClick={() => setIsArchiveModalOpen(true)}
                                    className="relative group p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                >
                                    <Archive className="w-4 h-4" />
                                    <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-white/10">
                                        Archive permanently
                                        <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900" />
                                    </div>
                                </button>
                            )}
                            {!appointment.is_archived && (
                                <button
                                    onClick={handleStartEditing}
                                    title="Edit details"
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Badges/Toggles */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${appointment.is_archived ? 'text-gray-600 bg-gray-100 border-gray-300' :
                        appointment.approved ? 'text-green-700 bg-green-50 border-green-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200'
                        }`}>
                        {appointment.is_archived ? <Archive className="w-3 h-3 mr-1" /> :
                            appointment.approved ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {appointment.is_archived ? 'Archived' : appointment.approved ? 'Approved' : 'Pending'}
                    </span>
                    <button
                        disabled={!isEditing || appointment.is_archived}
                        onClick={() => setFormData({ ...formData, is_commercial: !formData.is_commercial })}
                        className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${appointment.is_archived ? 'text-gray-500 bg-gray-50 border-gray-200 opacity-60' :
                            formData.is_commercial ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-teal-700 bg-teal-50 border-teal-200'
                            } ${isEditing ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}`}
                    >
                        {formData.is_commercial ? <Building className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                        {formData.is_commercial ? 'Commercial' : 'Residential'}
                    </button>
                </div>

                {/* Contact & Location Info */}
                <div className={`space-y-3 mb-6 text-left ${appointment.is_archived ? 'opacity-70' : ''}`}>
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Phone className={`w-4 h-4 mr-3 shrink-0 ${appointment.is_archived ? 'text-gray-400' : 'text-green-600'}`} />
                        {isEditing ? (
                            <input
                                className="border-b border-gray-200 outline-none w-full bg-gray-50/50"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        ) : appointment.phoneNumber}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Mail className={`w-4 h-4 mr-3 shrink-0 ${appointment.is_archived ? 'text-gray-400' : 'text-green-600'}`} />
                        {isEditing ? (
                            <input
                                className="border-b border-gray-200 outline-none w-full bg-gray-50/50"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        ) : appointment.email}
                    </div>
                    <div className="flex items-start text-gray-600 text-sm font-medium">
                        <MapPin className={`w-4 h-4 mr-3 mt-1 shrink-0 ${appointment.is_archived ? 'text-gray-400' : 'text-green-600'}`} />
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
                    {/* Added Referral Section */}
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Users className={`w-4 h-4 mr-3 shrink-0 ${appointment.is_archived ? 'text-gray-400' : 'text-green-600'}`} />
                        {isEditing ? (
                            <input
                                placeholder="Referral source..."
                                className="border-b border-gray-200 outline-none w-full bg-gray-50/50"
                                value={formData.referral_info || ''}
                                onChange={(e) => setFormData({ ...formData, referral_info: e.target.value })}
                            />
                        ) : (
                            <span className={!appointment.referral_info ? 'italic text-gray-400' : ''}>
                                {appointment.referral_info || 'No referral info'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Services Section */}
                <div className={`pt-4 border-t border-gray-100 text-left ${appointment.is_archived ? 'opacity-70' : ''}`}>
                    <p className="text-sm text-gray-500 mb-2 font-semibold uppercase tracking-wider">Requested Services</p>
                    {isEditing ? (
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {servicesLoading ? (
                                <div className="flex items-center gap-2 text-xs text-gray-500"><Loader2 className="w-3 h-3 animate-spin" /></div>
                            ) : (
                                <div className="grid grid-cols-1 gap-y-2">
                                    {allSystemServices.map(service => {
                                        const isChecked = formData.servicesRequested?.[service.name] === true || formData.servicesRequested?.[service.name] === "true";
                                        return (
                                            <label key={service.id} className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-lg ${isChecked ? 'bg-green-100/50' : 'hover:bg-gray-100'}`}>
                                                <input type="checkbox" checked={isChecked} onChange={() => handleServiceToggle(service.name)} className="accent-green-700" />
                                                <span className="text-xs font-semibold">{service.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : <p className={`font-medium ${appointment.is_archived ? 'text-gray-500' : 'text-gray-800'}`}>{servicesDisplay}</p>}
                </div>

                {/* Notes/Description */}
                {(appointment.description || isEditing) && (
                    <div className={`mt-4 rounded-xl p-4 border border-gray-100 text-left ${appointment.is_archived ? 'bg-gray-100/50' : 'bg-gray-50'}`}>
                        {isEditing ? (
                            <textarea
                                className="w-full bg-transparent outline-none text-sm text-gray-600 italic border-b border-green-200 min-h-[60px]"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Additional notes..."
                            />
                        ) : <p className="text-sm text-gray-600 italic">"{appointment.description}"</p>}
                    </div>
                )}
            </div>

            {/* Actions - Only show if not archived */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                {!appointment.is_archived ? (
                    !isEditing ? (
                        <>
                            <div className="flex items-center justify-center text-gray-500 text-xs font-medium mb-4">
                                <History className="w-3.5 h-3.5 mr-1.5" /> Submitted: {formattedSubmissionTime} ET
                            </div>
                            <div className="flex flex-row gap-3">
                                {!appointment.approved ? (
                                    <>
                                        <button onClick={() => onDeny(appointment.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 transition-all">
                                            <XCircle className="w-5 h-5" /> Deny
                                        </button>
                                        <button onClick={() => onApprove(appointment.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-green-700 hover:bg-green-600 text-white shadow-sm">
                                            <CheckCircle className="w-5 h-5" /> Approve
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => onCancel(appointment.id)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 transition-all">
                                        <XCircle className="w-5 h-5" /> Cancel Appointment
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <button onClick={() => { setIsEditing(false); setFormData({ ...appointment }); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50"><X className="w-5 h-5" /> Discard</button>
                            <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-green-700 text-white hover:bg-green-600 shadow-sm"><Save className="w-5 h-5" /> Save</button>
                        </div>
                    )
                ) : (
                    <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-2">
                        Archived Record
                        <div className="mt-1 text-[10px] normal-case font-medium">Submitted: {formattedSubmissionTime}</div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AppointmentCardUi;