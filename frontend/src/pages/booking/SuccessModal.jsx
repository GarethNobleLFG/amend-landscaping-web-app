import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuccessModal({ isOpen, firstName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          
          {/* Dark Overlay/Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
            className="relative bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border-2 border-green-100 z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
            >
              <Check className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={3} />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">Request Received!</h2>
            
            <p className="text-lg sm:text-xl text-gray-600 font-medium mb-8 leading-relaxed">
              Thanks for reaching out{firstName ? `, ${firstName}` : ''}. Our team will review your requested services and contact you shortly to confirm the appointment. <strong>Please check your email for confirmation.</strong>
            </p>
            
            <Link 
              to="/" 
              className="inline-flex w-full sm:w-auto items-center justify-center bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-700/30"
            >
              Return Home
            </Link>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}