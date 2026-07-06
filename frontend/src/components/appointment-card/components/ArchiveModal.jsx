import { createPortal } from 'react-dom'; // Add this import
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, AlertTriangle } from 'lucide-react';

export default function ArchiveModal({ isOpen, onClose, onConfirm, isProcessing }) {
    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 isolate">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isProcessing ? onClose : undefined}
                        className="fixed inset-0 bg-black/50 backdrop-blur-md"
                    ></motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden"
                    >
                        <div className="h-2 bg-amber-500 w-full"></div>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Archive className="w-8 h-8 text-amber-600" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Archive Record</h2>
                            <p className="text-gray-600 font-medium mb-6">
                                Are you sure you want to archive this appointment? 
                                <span className="block mt-2 text-amber-700 text-sm bg-amber-50 p-2 rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    This action is permanent and cannot be undone.
                                </span>
                            </p>
                            
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={onClose}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex justify-center items-center disabled:opacity-50"
                                >
                                    {isProcessing ? 'Archiving...' : 'Yes, Archive'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}