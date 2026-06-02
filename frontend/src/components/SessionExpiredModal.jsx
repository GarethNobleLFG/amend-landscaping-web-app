import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const SessionExpiredModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
        <p className="text-gray-600 mb-6">Your session has ended. Please log in again to continue.</p>

        <button
          onClick={onConfirm}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
        >
          Go to Login
        </button>
      </motion.div>
    </div>
  );
};

export default SessionExpiredModal;
