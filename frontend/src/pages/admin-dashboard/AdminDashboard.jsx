import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ClipboardList, LayoutDashboard, ImageIcon, MessageSquare } from 'lucide-react';
import { useGetAppointments, useApproveAppointment, useDenyAppointment, useCancelAppointment } from '../../hooks/appointmentHooks';
import AppointmentCard from '../../components/AppointmentCard';
import ApproveModal from './ApproveModal';
import DenyCancelModal from './DenyCancelModal';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building, User, Wrench } from 'lucide-react';
import ServicesTab from '../../components/ServicesCard';

import ImageRegistryTab from '../../components/ImageRegistryTab';
import LandingImagesTab from '../../components/LandingImagesTab';
import TestimoniesTab from '../../components/TestimoniesTab';
import SessionExpiredModal from '../../components/SessionExpiredModal';
import { useSessionExpired } from '../../hooks/useSessionExpired';


const AdminDashboard = () => {
    const { appointments, fetchAppointments, isLoading, error } = useGetAppointments();
    const { approveAppointment } = useApproveAppointment();
    const { denyAppointment } = useDenyAppointment();
    const { cancelAppointment } = useCancelAppointment();
    const { isSessionExpiredOpen, closeSessionExpired } = useSessionExpired();

    const [processingId, setProcessingId] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Modal State Control
    const [actionState, setActionState] = useState({ type: null, id: null });
    const closeModals = () => setActionState({ type: null, id: null });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        let isAdmin = false;

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                isAdmin = user.admin === true;
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        console.log('isSessionExpiredOpen:', isSessionExpiredOpen);

        if (!token || !isAdmin) {
            navigate('/admin');
            return;
        }

        setIsAuthenticated(true);
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAppointments();
        }
    }, [isAuthenticated]);

    const handleConfirmAction = async (customMessage) => {
        const { type, id } = actionState;
        setProcessingId(id);

        let result;
        if (type === 'approve') {
            result = await approveAppointment(id, customMessage);
        } else if (type === 'deny') {
            result = await denyAppointment(id, customMessage);
        } else if (type === 'cancel') {
            result = await cancelAppointment(id, customMessage);
        }

        if (result && result.success) {
            fetchAppointments();
            closeModals();
        } else if (result) {
            alert(result.error || `Failed to ${type} appointment.`);
        }

        setProcessingId(null);
    };

    const pendingAppointments = appointments.filter(app => !app.approved);
    const approvedAppointments = appointments.filter(app => app.approved);
    const displayedAppointments = activeTab === 'pending' ? pendingAppointments : approvedAppointments;

    // Segment into Residential and Commercial
    const commercialAppointments = displayedAppointments.filter(app => app.is_commercial);
    const residentialAppointments = displayedAppointments.filter(app => !app.is_commercial);

    if (!isAuthenticated  && !isSessionExpiredOpen){
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Top Navigation Bar Mock */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2 text-green-700">
                            <LayoutDashboard className="w-6 h-6" />
                            <span className="font-bold text-xl tracking-tight">Admin Portal</span>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                navigate('/admin');
                            }}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-green-500" />
                        Service Requests
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl font-medium">
                        Review and approve incoming landscaping requests. Approved appointments will automatically be scheduled.
                    </p>
                </motion.div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-5 mb-8 shadow-sm">
                        <p className="text-red-700 font-medium">Error loading appointments: {error}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-3 px-2 transition-all font-bold text-lg flex items-center gap-2 ${activeTab === 'pending'
                            ? 'border-b-2 border-green-600 text-green-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pending Priority
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'pending' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {pendingAppointments.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`pb-3 px-2 transition-all font-bold text-lg flex items-center gap-2 ${activeTab === 'approved'
                            ? 'border-b-2 border-green-600 text-green-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Approved
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {approvedAppointments.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`pb-3 px-2 transition-all font-bold text-lg flex items-center gap-2 ${activeTab === 'services'
                            ? 'border-b-2 border-green-600 text-green-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Wrench className="w-4 h-4" />
                        Manage Services
                    </button>
                    <button
                        onClick={() => setActiveTab('landing')}
                        className={`pb-3 px-2 transition-all font-bold text-lg whitespace-nowrap flex items-center gap-2 ${activeTab === 'landing'
                            ? 'border-b-2 border-green-600 text-green-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Landing Page
                    </button>
                    <button
                        onClick={() => setActiveTab('testimonies')}
                        className={`pb-3 px-2 transition-all font-bold text-lg flex items-center gap-2 ${activeTab === 'testimonies'
                            ? 'border-b-2 border-green-600 text-green-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Testimonies
                    </button>
                    <button
                        onClick={() => setActiveTab('registry')}
                        className={`pb-3 px-2 transition-all font-bold text-lg flex items-center gap-2 ${activeTab === 'registry'
                            ? 'border-b-2 border-green-600 text-green-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Image Registry
                    </button>
                </div>


                {activeTab === 'services' ? (
                    <ServicesTab />
                ) : activeTab === 'landing' ? ( // Add this block
                    <LandingImagesTab />
                ) : activeTab === 'registry' ? (
                    <ImageRegistryTab />
                ) : activeTab === 'testimonies' ? ( // Add this
                    <TestimoniesTab />
                ) : isLoading && appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 font-medium text-lg">Fetching requests...</p>
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {displayedAppointments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center justify-center"
                            >
                                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {activeTab === 'pending' ? "You're all caught up!" : "No approved requests yet."}
                                </h3>
                                <p className="text-gray-500 text-lg">
                                    {activeTab === 'pending'
                                        ? "There are no pending requests requiring your attention right now."
                                        : "Once you approve appointments, they will show up here."}
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-12">
                                {/* Residential Sub-section */}
                                {residentialAppointments.length > 0 && (
                                    <div className={commercialAppointments.length > 0 ? "pt-6 border-t border-gray-200/60" : ""}>
                                        <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2 tracking-tight">
                                            <User className="w-5 h-5 text-teal-600" />
                                            Residential {activeTab === 'pending' ? 'Requests' : 'Appointments'}
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 ml-1">
                                                {residentialAppointments.length}
                                            </span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            <AnimatePresence>
                                                {residentialAppointments.map((appointment) => (
                                                    <AppointmentCard
                                                        key={appointment.id}
                                                        appointment={appointment}
                                                        onApprove={(id) => setActionState({ type: 'approve', id })}
                                                        onDeny={(id) => setActionState({ type: 'deny', id })}
                                                        onCancel={(id) => setActionState({ type: 'cancel', id })}
                                                        isUpdating={processingId === appointment.id}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {/* Commercial Sub-section */}
                                {commercialAppointments.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2 tracking-tight">
                                            <Building className="w-5 h-5 text-blue-600" />
                                            Commercial {activeTab === 'pending' ? 'Requests' : 'Appointments'}
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 ml-1">
                                                {commercialAppointments.length}
                                            </span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            <AnimatePresence>
                                                {commercialAppointments.map((appointment) => (
                                                    <AppointmentCard
                                                        key={appointment.id}
                                                        appointment={appointment}
                                                        onApprove={(id) => setActionState({ type: 'approve', id })}
                                                        onDeny={(id) => setActionState({ type: 'deny', id })}
                                                        onCancel={(id) => setActionState({ type: 'cancel', id })}
                                                        isUpdating={processingId === appointment.id}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </main>

            {/* Render Modals */}
            <ApproveModal
                isOpen={actionState.type === 'approve'}
                onClose={closeModals}
                onConfirm={handleConfirmAction}
                isProcessing={processingId === actionState.id}
            />

            <DenyCancelModal
                isOpen={actionState.type === 'deny' || actionState.type === 'cancel'}
                actionType={actionState.type}
                onClose={closeModals}
                onConfirm={handleConfirmAction}
                isProcessing={processingId === actionState.id}
            />

            <SessionExpiredModal
                isOpen={isSessionExpiredOpen}
                onConfirm={() => {
                    closeSessionExpired();
                    navigate('/admin');
                }}
            />
        </div>
    );
};

export default AdminDashboard;