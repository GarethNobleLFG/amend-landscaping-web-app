import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const slideImages = [
  '/sample-imgs/betsys-cropped.jpg',
  '/sample-imgs/istockphoto-1312760160-612x612.jpg',
  '/sample-imgs/istockphoto-1347784849-612x612.jpg',
  '/sample-imgs/rsz_dsc_0034.jpg',
  '/sample-imgs/images.jpg'
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // <-- Add this line

  // Fast cycle: switch image every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextIndex = (currentIndex + 1) % slideImages.length;
  const prevIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50/50 to-green-100/30 text-gray-900 min-h-[85vh] flex flex-col lg:flex-row items-center w-full">
      
      {/* 
        -------------
        Left Side: Text Content 
        -------------
      */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full lg:w-1/2 px-8 lg:pl-16 lg:pr-12 pt-16 pb-12 lg:py-24 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        <div className="inline-block bg-white text-green-800 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-green-200">
          Premium Lawn Care
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-5 leading-tight tracking-tight text-gray-900 drop-shadow-sm">
          Transform Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 drop-shadow-sm hover:-translate-y-1 inline-block transition-transform duration-300">
            Outdoor Space
          </span>
        </h1>
        
        <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-700 font-medium max-w-lg">
          Professional landscaping, lawn maintenance, and custom design to bring your vision to life effortlessly.
        </p>

        {/* Primary Button + Helpers Block */}
        <div className="flex flex-col items-center lg:items-start gap-2 w-full mt-4">
          <motion.button
            onClick={() => navigate('/book')} 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0px 0px 0px 0px rgba(21, 128, 61, 0.6)",
                "0px 0px 0px 20px rgba(21, 128, 61, 0)",
                "0px 0px 0px 0px rgba(21, 128, 61, 0)"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-600 transition-all w-full sm:w-auto overflow-visible relative text-center"
          >
            Book an Appointment
          </motion.button>
          
          {/* Subtext under primary button */}
          <span className="text-xs text-gray-500 italic mt-1 font-medium select-none">
            (Residential or Commercial)
          </span>
        </div>
      </motion.div>

      {/* 
        -------------
        Right Side: Dynamic Expansive Image Collage 
        -------------
      */}
      {/* On desktop, this container breaks out of the normal flex flow to absolutely pin to the right edge and stretch full height */}
      <div className="relative z-10 w-full h-[600px] lg:h-auto lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
        
        {/* Massive background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-300 rounded-full blur-[140px] opacity-40 mix-blend-multiply"></div>

        <div className="relative w-full h-full pointer-events-none perspective-[1000px]">
          <AnimatePresence mode="popLayout">
            
            {/* Background/Offset Image (Previous) */}
            <motion.img
              key={`prev-${currentIndex}`}
              src={slideImages[prevIndex]}
              initial={{ opacity: 0, x: '-30%', y: '10%', rotate: -15, scale: 0.8 }}
              animate={{ opacity: 0.6, x: '-15%', y: '-10%', rotate: -8, scale: 0.9 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
              className="absolute top-[10%] lg:top-[15%] left-[5%] lg:-left-[5%] w-[65%] h-[45%] lg:h-[50%] object-cover rounded-[2rem] shadow-2xl border-[6px] border-white grayscale-[20%]"
            />

            {/* Background/Offset Image (Next) */}
            <motion.img
              key={`next-${currentIndex}`}
              src={slideImages[nextIndex]}
              initial={{ opacity: 0, x: '30%', y: '-10%', rotate: 15, scale: 0.8 }}
              animate={{ opacity: 0.6, x: '15%', y: '10%', rotate: 8, scale: 0.9 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
              className="absolute bottom-[10%] lg:bottom-[15%] right-[5%] lg:-right-[5%] w-[65%] h-[45%] lg:h-[50%] object-cover rounded-[2rem] shadow-2xl border-[6px] border-white grayscale-[20%]"
            />

            {/* Primary Center Image - Stretching almost the entire container */}
            <motion.img
              key={`curr-${currentIndex}`}
              src={slideImages[currentIndex]}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.9, rotate: -5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] lg:w-[90%] h-[70%] lg:h-[80%] object-cover rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-[10px] lg:border-[16px] border-white z-20"
            />

          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}