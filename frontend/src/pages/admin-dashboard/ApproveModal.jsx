import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function ApproveModal({ isOpen, onClose, onConfirm, isProcessing }) {
    const [message, setMessage] = useState('');

    const handleConfirm = () => {
        onConfirm(message);
        setMessage(''); 
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isProcessing ? onClose : undefined}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    ></motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden"
                    >
                        <div className="h-2 bg-green-500 w-full"></div>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Approve Request</h2>
                            <p className="text-gray-600 mb-4 font-medium">
                                Are you sure you want to approve this request? It will be moved to the approved schedule.
                            </p>
                            
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Optional custom message to the customer..."
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-sm transition-all"
                                rows="3"
                                disabled={isProcessing}
                            />
                            
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={onClose}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing' : 'Approve'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
