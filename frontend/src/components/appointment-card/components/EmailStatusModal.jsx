import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const EmailStatusModal = ({ isOpen, onClose, success, message, recipient }) => {
    if (!isOpen) return null;

    // Helper to format the message: Color/Capitalize the second word (the action type)
    const formatMessage = (rawMessage) => {
        if (!rawMessage) return null;
        const words = rawMessage.split(' ');
        
        return words.map((word, index) => {
            if (index === 1) {
                const action = word.toUpperCase();
                const colorClass = 
                    action === 'APPROVE' ? 'text-green-600' :
                    action === 'DENY' ? 'text-amber-600' :
                    action === 'CANCEL' ? 'text-red-600' : 
                    'text-indigo-600';

                return (
                    <span key={index} className={`font-black ${colorClass}`}>
                        {action}{' '}
                    </span>
                );
            }
            return <span key={index}>{word}{' '}</span>;
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center pt-12">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                        success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        {success ? (
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        ) : (
                            <XCircle className="w-10 h-10 text-red-600" />
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {success ? 'Notification Sent!' : 'Update Failed'}
                    </h3>
                    
                    <div className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {formatMessage(message)}
                        {recipient && (
                            <div className="mt-3 py-2 px-4 bg-gray-50 rounded-xl border border-gray-100 block font-mono text-sm font-semibold text-gray-700 break-all text-center">
                                {recipient}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-[0.98] shadow-lg ${
                            success ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                        }`}
                    >
                        Dismiss
                    </button>
                </div>

                <div className={`h-2 w-full ${success ? 'bg-green-600' : 'bg-red-600'}`} />
            </motion.div>
        </div>,
        document.body
    );
};

export default EmailStatusModal;