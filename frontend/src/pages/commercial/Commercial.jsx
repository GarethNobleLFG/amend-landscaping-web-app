import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Commercial() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-800 font-sans selection:bg-green-200 flex flex-col justify-between">
      
      {/* --- Navigation Header --- */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 lg:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm flex justify-between items-center sticky top-0 z-50 transition-all font-medium"
      >
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-2xl font-black text-green-800 tracking-tight cursor-pointer"
        >
          Amend <Leaf className="w-6 h-6 text-green-600 fill-green-600/20" /> <span className="text-gray-900">Landscaping</span>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="text-gray-600 hover:text-green-700 transition-colors font-bold text-sm tracking-wide uppercase px-4 py-2 hover:bg-neutral-100 rounded-lg"
        >
          Back To Home
        </button>
      </motion.header>

      {/* --- Spanning Split-Layout Service Welcome --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Welcome Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div className="inline-flex bg-green-50 text-green-800 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-green-100 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Commercial Division
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-tight mb-6">
            Commercial Property <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
              Management Service
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium max-w-xl">
            Welcome to Amend Landscaping’s premium commercial grounds care service. We deliver scale-adjusted turf maintenance, structured seasonal rotations, and seamless project management custom-tailored for your organization.
          </p>

          <motion.button
            onClick={() => navigate('/book', { state: { isCommercial: true } })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group bg-green-700 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-lg lg:text-xl shadow-lg hover:shadow-green-900/10 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Click Here to Register Commercial Property
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Right Side: Elegant Spanning Presentation Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative w-full h-[380px] md:h-[450px]"
        >
          {/* Decorative Back Gradients matching Landing Page Theme */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-green-300 rounded-full blur-[100px] opacity-30 mix-blend-multiply pointer-events-none"></div>
          
          <img 
            src="/sample-imgs/istockphoto-1312760160-612x612.jpg" 
            alt="Pristine Commercial Estate Lawn Care" 
            className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-[8px] md:border-[12px] border-white z-10 relative"
          />
        </motion.div>

      </main>

      {/* --- Exact Landing Page Replicated Footer --- */}
      <footer className="bg-white border-t border-gray-200 py-16 text-center relative z-20">
        <h3 className="text-2xl font-extrabold text-green-700 tracking-tight mb-3">
          Amend<span className="text-gray-800 font-bold">Landscaping</span>
        </h3>
        <p className="mb-8 font-medium text-gray-600">Making neighborhoods beautiful, one yard at a time.</p>
        <div className="w-16 h-[2px] bg-green-200 mx-auto mb-8 rounded-full"></div>
        <p className="text-xs text-gray-400 tracking-wider uppercase font-bold">
          &copy; {new Date().getFullYear()} Amend Landscaping. All rights reserved.
        </p>
      </footer>

    </div>
  );
}