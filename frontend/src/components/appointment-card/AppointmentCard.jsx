import { useState, useEffect } from 'react';
import { useGetAvailableServices } from '../../hooks/serviceHooks';
import {
    useMarkAppointmentAsSeen,
    useArchiveAppointment,
    useApproveAppointment,
    useDenyAppointment,
    useCancelAppointment
} from '../../hooks/appointmentHooks';
import AppointmentCardUi from './components/AppointmentCardUi';
import ArchiveModal from './components/ArchiveModal';
import ApproveModal from './components/ApproveModal';
import DenyCancelModal from './components/DenyCancelModal';
import EmailStatusModal from './components/EmailStatusModal';

const AppointmentCard = (props) => {
    const { appointment, onUpdate, onUpdateSuccess } = props;

    // State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...appointment });
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Email status modal state.
    const [emailStatus, setEmailStatus] = useState({
        isOpen: false,
        success: false,
        message: '',
        recipient: ''
    });

    // Hooks
    const { markAsSeen } = useMarkAppointmentAsSeen();
    const { archiveAppointment, isLoading: isArchiving } = useArchiveAppointment();
    const { approveAppointment } = useApproveAppointment();
    const { denyAppointment } = useDenyAppointment();
    const { cancelAppointment } = useCancelAppointment();
    const { services: allSystemServices, fetchServices, isLoading: servicesLoading } = useGetAvailableServices();

    useEffect(() => {
        if (isEditing) fetchServices();
    }, [isEditing, fetchServices]);

    const handleMouseEnter = async () => {
        if (!appointment.is_seen) {
            const result = await markAsSeen(appointment.id);
            if (result.success && onUpdateSuccess) onUpdateSuccess();
        }
    };

    const handleConfirmArchive = async () => {
        const result = await archiveAppointment(appointment.id);
        if (result.success) {
            setIsArchiveModalOpen(false);
            if (onUpdateSuccess) onUpdateSuccess();
        }
        else {
            alert(result.error || "Failed to archive appointment");
        }
    };

    const handleConfirmAction = async (customMessage) => {
        setIsProcessing(true);
        let result;

        if (actionType === 'approve') {
            result = await approveAppointment(appointment.id, customMessage);
        }
        else if (actionType === 'deny') {
            result = await denyAppointment(appointment.id, customMessage);
        }
        else if (actionType === 'cancel') {
            result = await cancelAppointment(appointment.id, customMessage);
        }

        setIsProcessing(false);

        if (result && result.success) {
            setActionType(null);

            setEmailStatus({
                isOpen: true,
                success: true,
                message: `The ${actionType} email was delivered successfully to:`,
                recipient: appointment.email
            });
        }
        else if (result) {
            setEmailStatus({
                isOpen: true,
                success: false,
                message: `There was an error communicating with the email server. The appointment was updated, but the client may not have received the notification.`,
                recipient: appointment.email
            });
        }
    };

    const handleStartEditing = () => {
        setFormData({ ...appointment });
        setIsEditing(true);
    };

    const handleSave = async () => {
        const result = await onUpdate(appointment.id, formData);
        if (result.success) {
            setIsEditing(false);
            if (onUpdateSuccess) onUpdateSuccess();
        }
    };

    const handleServiceToggle = (serviceName) => {
        setFormData(prev => ({
            ...prev,
            servicesRequested: {
                ...prev.servicesRequested,
                [serviceName]: !prev.servicesRequested?.[serviceName]
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
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <>
            <AppointmentCardUi
                {...props}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                setIsArchiveModalOpen={setIsArchiveModalOpen}
                servicesLoading={servicesLoading}
                allSystemServices={allSystemServices}
                servicesDisplay={servicesDisplay}
                formattedSubmissionTime={formattedSubmissionTime}
                handleMouseEnter={handleMouseEnter}
                handleStartEditing={handleStartEditing}
                handleSave={handleSave}
                handleServiceToggle={handleServiceToggle}
                setIsEditing={setIsEditing}
                onApprove={() => setActionType('approve')}
                onDeny={() => setActionType('deny')}
                onCancel={() => setActionType('cancel')}
            />

            <ArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onConfirm={handleConfirmArchive}
                isProcessing={isArchiving}
            />

            <ApproveModal
                isOpen={actionType === 'approve'}
                onClose={() => setActionType(null)}
                onConfirm={handleConfirmAction}
                isProcessing={isProcessing}
            />

            <DenyCancelModal
                isOpen={actionType === 'deny' || actionType === 'cancel'}
                actionType={actionType}
                onClose={() => setActionType(null)}
                onConfirm={handleConfirmAction}
                isProcessing={isProcessing}
            />

            <EmailStatusModal
                isOpen={emailStatus.isOpen}
                onClose={() => {
                    setEmailStatus(prev => ({ ...prev, isOpen: false }));
                    if (emailStatus.success && onUpdateSuccess) {
                        onUpdateSuccess();
                    }
                }}
                success={emailStatus.success}
                message={emailStatus.message}
                recipient={emailStatus.recipient}
            />
        </>
    );
};

export default AppointmentCard;