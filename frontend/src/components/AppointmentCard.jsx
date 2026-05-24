import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, CheckCircle, Clock, XCircle, History } from 'lucide-react';

const AppointmentCard = ({ appointment, onApprove, onDeny, onCancel, isUpdating }) => {
    const {
        id, name, email, phoneNumber, address, city, state, zip,
        servicesRequested, description, approved, createdAt
    } = appointment;

    let services = 'None specified';
    if (servicesRequested) {
        services = Object.entries(servicesRequested)
            .filter(([isRequested]) => isRequested)
            .map(([serviceName]) => serviceName.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()))
            .join(', ');
    }

    const formattedSubmissionTime = createdAt
        ? new Date(createdAt).toLocaleString('en-US', {
            timeZone: 'America/New_York',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
        : 'Unknown';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all p-6 flex flex-col h-full relative overflow-hidden flex-shrink-0"
        >
            {/* Top Banner accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${approved ? 'from-green-500 to-green-600' : 'from-yellow-400 to-yellow-500'}`}></div>

            <div className="flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                        {approved ? (
                            <span className="flex items-center text-sm font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full w-max mt-2">
                                <CheckCircle className="w-3 h-3 mr-1" /> Approved
                            </span>
                        ) : (
                            <span className="flex items-center text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full w-max mt-2">
                                <Clock className="w-3 h-3 mr-1" /> Pending Approval
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Phone className="w-4 h-4 mr-3 text-green-600" />
                        {phoneNumber}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm font-medium">
                        <Mail className="w-4 h-4 mr-3 text-green-600" />
                        {email}
                    </div>
                    <div className="flex items-start text-gray-600 text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-3 text-green-600 mt-0.5 shrink-0" />
                        <span>{address}, <br />{city}, {state} {zip}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Requested Services</p>
                    <p className="text-gray-800 font-medium">{services}</p>
                </div>

                {description && (
                    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-600 italic">"{description}"</p>
                    </div>
                )}
            </div>

            {/* Button Render Logic varies based on Approval State */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                {createdAt && (
                    <div className="flex items-center justify-center text-gray-500 text-xs font-medium mb-4">
                        <History className="w-3.5 h-3.5 mr-1.5" />
                        Submitted: {formattedSubmissionTime} ET
                    </div>
                )}
                {!approved ? (
                    <div className="flex flex-row gap-3">
                        <button
                            onClick={() => onDeny(id)}
                            disabled={isUpdating}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-sm ${isUpdating
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-[0.98]'
                                }`}
                        >
                            <XCircle className="w-5 h-5" /> Deny
                        </button>

                        <button
                            onClick={() => onApprove(id)}
                            disabled={isUpdating}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-sm ${isUpdating
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-700 hover:bg-green-600 text-white hover:shadow-md active:scale-[0.98]'
                                }`}
                        >
                            <CheckCircle className="w-5 h-5" /> Approve
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onCancel(id)}
                        disabled={isUpdating}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-sm ${isUpdating
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-[0.98]'
                            }`}
                    >
                        <XCircle className="w-5 h-5" /> Cancel Appointment
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default AppointmentCard;
